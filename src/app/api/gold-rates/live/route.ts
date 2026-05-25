import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

const TROY_OZ_TO_GRAM = 31.1034768;

interface LiveGoldResult {
  spot_price_usd_per_oz: number;
  spot_price_usd_per_gram: number;
  rates: {
    purity: string;
    purity_km: string;
    rate_per_gram_usd: number;
    karat: number;
  }[];
  source: string;
  timestamp: string;
}

async function fetchSpotPrice(): Promise<{ price: number; source: string } | null> {
  // Try Yahoo Finance gold futures (GC=F)
  try {
    const quote = await yahooFinance.quote('GC=F') as { regularMarketPrice?: number };
    if (quote?.regularMarketPrice) {
      return { price: quote.regularMarketPrice, source: 'yahoo finance (GC=F)' };
    }
  } catch {
    // fall through
  }

  // Fallback: try GLD ETF
  try {
    const quote = await yahooFinance.quote('GLD') as { regularMarketPrice?: number };
    if (quote?.regularMarketPrice) {
      // GLD is ~1/10 of gold spot price
      return { price: quote.regularMarketPrice * 10, source: 'yahoo finance (GLD)' };
    }
  } catch {
    // fall through
  }

  return null;
}

export async function GET() {
  const result = await fetchSpotPrice();
  let spotPerOz: number;
  let source: string;

  if (result) {
    spotPerOz = result.price;
    source = result.source;
  } else {
    spotPerOz = 2350.0;
    source = 'fallback (estimated market rate)';
  }

  const spotPerGram = spotPerOz / TROY_OZ_TO_GRAM;

  const rates = [
    { purity: '24K Gold', purity_km: 'មាស ២៤K', karat: 24 },
    { purity: '22K Gold', purity_km: 'មាស ២២K', karat: 22 },
    { purity: '18K Gold', purity_km: 'មាស ១៨K', karat: 18 },
    { purity: 'White Gold 18K', purity_km: 'មាសស ១៨K', karat: 18 },
  ].map((r) => {
    let rate = spotPerGram * (r.karat / 24);
    if (r.purity === 'White Gold 18K') {
      rate *= 1.08;
    }
    return {
      purity: r.purity,
      purity_km: r.purity_km,
      rate_per_gram_usd: Math.round(rate * 100) / 100,
      karat: r.karat,
    };
  });

  const response: LiveGoldResult = {
    spot_price_usd_per_oz: Math.round(spotPerOz * 100) / 100,
    spot_price_usd_per_gram: Math.round(spotPerGram * 100) / 100,
    rates,
    source,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response);
}
