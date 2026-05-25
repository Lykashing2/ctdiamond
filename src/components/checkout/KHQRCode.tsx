'use client';

import { useId } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { formatUSD } from '@/lib/utils/pricing';

interface KHQRCodeProps {
  amount: number;
  merchantName?: string;
  merchantId?: string;
}

export function KHQRCode({ amount, merchantName = 'CT Diamond Jewelry', merchantId = 'ctdiamond_khqr' }: KHQRCodeProps) {
  const { t } = useLanguage();
  const nonce = useId();

  const khqrPayload = `KHQR|${merchantId}|${merchantName}|USD|${amount.toFixed(2)}|${nonce}`;

  return (
    <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-lg border border-gray-200">
      <h4 className="text-sm font-semibold text-gray-900">{t('checkout.scan_khqr')}</h4>
      <div className="p-3 bg-white rounded-lg shadow-sm border">
        <QRCodeSVG value={khqrPayload} size={200} level="M" />
      </div>
      <p className="text-lg font-bold text-gray-900">{formatUSD(amount)}</p>
      <p className="text-xs text-gray-500 text-center">
        {merchantName}
      </p>
    </div>
  );
}
