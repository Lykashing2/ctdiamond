'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { useCartStore } from '@/lib/stores/cartStore';
import { useAuthStore } from '@/lib/stores/authStore';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { KHQRCode } from '@/components/checkout/KHQRCode';
import { ReturnPolicyTable } from '@/components/checkout/ReturnPolicyTable';
import { PriceBreakdown } from '@/components/product/PriceBreakdown';
import { formatUSD } from '@/lib/utils/pricing';
import { supabase } from '@/lib/supabase/client';
import { AlertCircle, CheckCircle } from 'lucide-react';
import type { Product } from '@/lib/types';

export default function CheckoutPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const directProductId = searchParams.get('product');
  const { items, subtotal, clearCart } = useCartStore();
  const { phone, isVerified, name, setPhone, setVerified, setName } = useAuthStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [phoneInput, setPhoneInput] = useState(phone || '');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [address, setAddress] = useState('');
  const [customerName, setCustomerName] = useState(name);
  const [deliveryZone, setDeliveryZone] = useState('phnom_penh');
  const [zoneError, setZoneError] = useState(false);
  const [paymentStep, setPaymentStep] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');

  const activeProduct = directProductId ? product : items[0]?.product;
  const totalAmount = directProductId
    ? activeProduct?.pricing.total_selling_usd || 0
    : subtotal();

  useEffect(() => {
    if (directProductId) {
      supabase
        .from('products')
        .select('*')
        .eq('product_id', directProductId)
        .single()
        .then(({ data }) => {
          if (data) setProduct(data as Product);
        });
    }
  }, [directProductId]);

  const handleSendOtp = async () => {
    if (!phoneInput || phoneInput.length < 8) return;
    setLoading(true);
    setError('');
    try {
      const { error: err } = await supabase.from('otp_codes').insert({
        phone: phoneInput,
        code: '123456',
        expires_at: new Date(Date.now() + 5 * 60000).toISOString(),
      });
      if (err) throw err;
      setOtpSent(true);
      setPhone(phoneInput);
    } catch (e) {
      setError((e as Error).message);
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: err } = await supabase
        .from('otp_codes')
        .select('*')
        .eq('phone', phoneInput)
        .eq('code', otpInput)
        .eq('verified', false)
        .gte('expires_at', new Date().toISOString())
        .single();
      if (err || !data) {
        setError('Invalid or expired OTP');
        setLoading(false);
        return;
      }
      await supabase.from('otp_codes').update({ verified: true }).eq('id', data.id);
      setVerified(true);
      setName(customerName);
    } catch (e) {
      setError((e as Error).message);
    }
    setLoading(false);
  };

  const handleProceedToPayment = async () => {
    if (!activeProduct || !isVerified || !phone) return;

    if (deliveryZone !== 'phnom_penh') {
      setZoneError(true);
      return;
    }
    setZoneError(false);
    setLoading(true);
    setError('');

    try {
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .insert({
          product_id: activeProduct.product_id,
          customer_phone: phone,
          customer_name: customerName || 'Customer',
          delivery_address: address,
          delivery_zone: deliveryZone,
          subtotal_usd: totalAmount,
          shipping_fee_usd: 0,
          total_usd: totalAmount,
          payment_method: 'khqr',
          payment_status: 'PENDING',
          stock_status: 'PENDING_PAYMENT',
          is_international: deliveryZone !== 'phnom_penh',
        })
        .select()
        .single();

      if (orderErr) throw orderErr;

      // Lock inventory: set PENDING_PAYMENT
      await supabase
        .from('products')
        .update({ stock_status: 'PENDING_PAYMENT' })
        .eq('product_id', activeProduct.product_id);

      setOrderId(orderData.id);
      setPaymentStep(true);
      clearCart();
    } catch (e) {
      setError((e as Error).message);
    }
    setLoading(false);
  };

  const handlePaymentSuccess = async () => {
    await supabase
      .from('products')
      .update({ stock_status: 'SOLD' })
      .eq('product_id', activeProduct?.product_id);
    await supabase
      .from('orders')
      .update({ payment_status: 'PAID', stock_status: 'SOLD' })
      .eq('id', orderId);
    setOrderComplete(true);
  };

  const handlePaymentFailed = async () => {
    await supabase
      .from('products')
      .update({ stock_status: 'AVAILABLE' })
      .eq('product_id', activeProduct?.product_id);
    await supabase
      .from('orders')
      .update({ payment_status: 'FAILED', stock_status: 'AVAILABLE' })
      .eq('id', orderId);
    setPaymentStep(false);
  };

  if (orderComplete) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
        <h2 className="text-xl font-bold text-gray-900 mb-2">{t('invoice.title')}</h2>
        <p className="text-gray-500 mb-1">{t('invoice.no')}: {orderId?.slice(0, 8)}</p>
        <p className="text-sm text-gray-600 mb-6">{t('invoice.thank_you')}</p>
              {activeProduct && (
                  <div className="text-left">
                    <PriceBreakdown pricing={activeProduct.pricing} />
                    <ReturnPolicyTable />
                  </div>
                )}
      </div>
    );
  }

  if (paymentStep) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <KHQRCode amount={totalAmount} />
        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={handlePaymentFailed}>
            {t('common.cancel')}
          </Button>
          <Button className="flex-1" onClick={handlePaymentSuccess}>
            {t('checkout.pay')}
          </Button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-4">
          15:00 {t('product.stock.pending')}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">{t('checkout.title')}</h1>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md mb-4">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Phone & OTP */}
      <div className="bg-white rounded-lg border border-gray-100 p-4 mb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('checkout.phone')}</h3>
        <div className="flex gap-2">
          <Input
            placeholder="012 345 678"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            disabled={otpSent}
          />
          {!otpSent ? (
            <Button onClick={handleSendOtp} disabled={loading || phoneInput.length < 8}>
              {t('checkout.send_otp')}
            </Button>
          ) : !isVerified ? (
            <>
              <Input
                placeholder="000000"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                className="w-24"
              />
              <Button onClick={handleVerifyOtp} disabled={loading}>
                {t('checkout.verify')}
              </Button>
            </>
          ) : (
            <span className="flex items-center text-sm text-green-600">
              <CheckCircle size={16} className="mr-1" /> {t('checkout.verify')}
            </span>
          )}
        </div>
      </div>

      {isVerified && (
        <>
          {/* Customer Info */}
          <div className="bg-white rounded-lg border border-gray-100 p-4 mb-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">{t('checkout.name')}</h3>
            <Input
              placeholder="Your name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          {/* Delivery */}
          <div className="bg-white rounded-lg border border-gray-100 p-4 mb-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">{t('checkout.delivery')}</h3>
            <Input
              placeholder="Street, Building, etc."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Select
              value={deliveryZone}
              onChange={(e) => setDeliveryZone(e.target.value)}
              options={[
                { value: 'phnom_penh', label: 'Phnom Penh' },
                { value: 'other', label: 'Other Province' },
                { value: 'international', label: 'International' },
              ]}
            />
            {zoneError && (
              <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-md">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                {t('checkout.delivery.zone_error')}
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('checkout.delivery.fee')}</span>
              <span className="text-green-600 font-medium">{t('checkout.delivery.free')}</span>
            </div>
          </div>

          {/* Order Summary */}
          {activeProduct && (
            <div className="bg-white rounded-lg border border-gray-100 p-4 mb-4">
              <PriceBreakdown pricing={activeProduct.pricing} />
              <div className="flex justify-between items-center mt-3 pt-3 border-t font-bold text-lg">
                <span>{t('checkout.title')}</span>
                <span className="text-amber-700">{formatUSD(totalAmount)}</span>
              </div>
            </div>
          )}

          <Button className="w-full" size="lg" onClick={handleProceedToPayment} disabled={loading}>
            {t('checkout.scan_khqr')}
          </Button>
        </>
      )}
    </div>
  );
}
