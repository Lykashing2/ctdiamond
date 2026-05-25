'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Calendar, DollarSign, ArrowLeft, LogOut } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { useAdminStore } from '@/lib/stores/adminStore';
import { cn } from '@/lib/utils/cn';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, labelKey: 'admin.dashboard' },
  { href: '/admin/products', icon: Package, labelKey: 'admin.products' },
  { href: '/admin/orders', icon: ShoppingBag, labelKey: 'admin.orders' },
  { href: '/admin/appointments', icon: Calendar, labelKey: 'admin.appointments' },
  { href: '/admin/gold-rates', icon: DollarSign, labelKey: 'admin.gold_rates' },
];

const publicAdminPaths = ['/admin/login'];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const { isAuthenticated, checking, checkAuth, logout } = useAdminStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (checking) return;
    if (!isAuthenticated && !publicAdminPaths.includes(pathname)) {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, checking, pathname, router]);

  if (publicAdminPaths.includes(pathname)) {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-amber-700 mb-3">
            <ArrowLeft size={16} /> {t('nav.home')}
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-gray-900">CT Diamond</h2>
              <p className="text-xs text-gray-500">{t('nav.admin')}</p>
            </div>
            <button
              onClick={() => { logout(); router.push('/admin/login'); }}
              className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                  active
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                <Icon size={18} />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="lg:hidden flex items-center justify-between gap-3 p-3 bg-white border-b sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-500">
              <ArrowLeft size={18} />
            </Link>
            <span className="text-sm font-semibold text-gray-900">{t('nav.admin')}</span>
          </div>
          <button
            onClick={() => { logout(); router.push('/admin/login'); }}
            className="p-1.5 text-gray-400 hover:text-red-500 rounded-md"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
        <div className="flex-1 p-4 lg:p-6 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
