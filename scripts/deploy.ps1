param(
  [string]$SupabaseProject,
  [string]$VercelTeam
)

Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   CT Diamond Jewelry - Deploy Script    ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ─── Step 1: Supabase ───
Write-Host "── Step 1: Supabase Setup ──" -ForegroundColor Yellow

# Check if logged in
$supaUser = npx supabase whoami 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Host "Logging into Supabase..." -ForegroundColor Yellow
  npx supabase login
}

if (-not $SupabaseProject) {
  Write-Host ""
  Write-Host "Do you want to:" -ForegroundColor White
  Write-Host "  1. Create a NEW Supabase project"
  Write-Host "  2. Link an EXISTING project"
  $choice = Read-Host "Enter 1 or 2"
} else {
  $choice = "2"
  $env:SUPABASE_PROJECT = $SupabaseProject
}

if ($choice -eq "1") {
  Write-Host "Creating Supabase project..." -ForegroundColor Yellow
  npx supabase projects create "ct-diamond" --org-id "your-org-id" --db-password (Read-Host "Enter database password (min 8 chars)" -AsSecureString)
  Write-Host "Project created! Run this script again with -SupabaseProject <project-ref>" -ForegroundColor Green
  exit 0
}

if (-not $SupabaseProject) {
  $SupabaseProject = Read-Host "Enter your Supabase project reference ID"
}

# Link and apply schema
Write-Host "Linking Supabase project: $SupabaseProject ..." -ForegroundColor Yellow
npx supabase link --project-ref $SupabaseProject

Write-Host "Applying database schema..." -ForegroundColor Yellow
npx supabase db push

# Get project info for env vars
$projectInfo = npx supabase projects list 2>&1 | Select-String $SupabaseProject
Write-Host ""

# ─── Step 2: Environment File ───
Write-Host "── Step 2: Environment Variables ──" -ForegroundColor Yellow

$supabaseUrl = "https://$SupabaseProject.supabase.co"
Write-Host "Supabase URL: $supabaseUrl" -ForegroundColor Green
$anonKey = Read-Host "Enter your Supabase anon key (find in Project Settings > API)"
$serviceKey = Read-Host "Enter your Supabase service_role key (keep secret!)"

@"
NEXT_PUBLIC_SUPABASE_URL=$supabaseUrl
NEXT_PUBLIC_SUPABASE_ANON_KEY=$anonKey
SUPABASE_URL=$supabaseUrl
SUPABASE_SERVICE_ROLE_KEY=$serviceKey
NEXT_PUBLIC_APP_URL=https://ct-diamond.vercel.app
"@ | Out-File -FilePath ".env.production" -Encoding utf8

Write-Host ".env.production created" -ForegroundColor Green

# ─── Step 3: Deploy to Vercel ───
Write-Host ""
Write-Host "── Step 3: Vercel Deployment ──" -ForegroundColor Yellow

# Check logged in
$vercelUser = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Host "Logging into Vercel..." -ForegroundColor Yellow
  vercel login
}

Write-Host "Linking project..." -ForegroundColor Yellow
if ($VercelTeam) {
  vercel link --yes --project "ct-diamond" --scope $VercelTeam
} else {
  vercel link --yes --project "ct-diamond"
}

# Set env vars on Vercel
Write-Host "Setting environment variables on Vercel..." -ForegroundColor Yellow
vercel env add NEXT_PUBLIC_SUPABASE_URL production < .env.production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add NEXT_PUBLIC_APP_URL production <<< "https://ct-diamond.vercel.app"

# Deploy
Write-Host ""
Write-Host "Deploying to Vercel..." -ForegroundColor Yellow
vercel --prod

Write-Host ""
Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   Deployment complete!                   ║" -ForegroundColor Green
Write-Host "║   Add this to Supabase Realtime:          ║" -ForegroundColor Green
Write-Host "║   Go to Database > Replication >          ║" -ForegroundColor Green
Write-Host "║   Enable replication for: products,       ║" -ForegroundColor Green
Write-Host "║   gold_rates, orders                      ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Green
