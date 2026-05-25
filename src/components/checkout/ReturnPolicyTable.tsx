'use client';

import { useLanguage } from '@/lib/i18n/LanguageProvider';

export function ReturnPolicyTable() {
  const { t } = useLanguage();

  const rows = [
    { labelKey: 'invoice.policy.wg', exchange: '-5%', cashReturn: '-10%' },
    { labelKey: 'invoice.policy.dj', exchange: '-3%', cashReturn: '-7%' },
    { labelKey: 'invoice.policy.ig', exchange: '-0%', cashReturn: '-20%' },
  ];

  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      <h4 className="text-sm font-semibold text-gray-900 mb-2">{t('invoice.policy')}</h4>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b text-gray-500">
            <th className="text-left py-1.5 font-medium">{t('invoice.policy.category')}</th>
            <th className="text-right py-1.5 font-medium">{t('invoice.policy.exchange')}</th>
            <th className="text-right py-1.5 font-medium">{t('invoice.policy.cash_return')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.labelKey} className="border-b border-gray-50">
              <td className="py-1.5 text-gray-700">{t(row.labelKey)}</td>
              <td className="py-1.5 text-right text-gray-700">{row.exchange}</td>
              <td className="py-1.5 text-right text-gray-700">{row.cashReturn}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
