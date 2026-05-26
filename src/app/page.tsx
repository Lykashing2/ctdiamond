'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin, ChevronRight, ExternalLink, Phone, Gem, ShieldCheck, Star, Sparkles, Award, MessageCircle, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { ProductCard } from '@/components/product/ProductCard';
import { useProductStore } from '@/lib/stores/productStore';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

const testimonials = [
  { name: 'Sophea C.', rating: 5, text: { en: 'Exceptional quality and service. They helped me find the perfect engagement ring.', km: 'គុណភាពនិងសេវាកម្មល្អឥតខ្ចោះ។ ពួកគេបានជួយខ្ញុំរកចិញ្ចៀនភ្ជាប់ពាក់ដ៏ល្អឥតខ្ចោះ។' } },
  { name: 'Malis P.', rating: 5, text: { en: 'The custom design process was incredible. My necklace is one of a kind!', km: 'ដំណើរការរចនាផ្ទាល់ខ្លួនពិតជាអស្ចារ្យ។ ខ្សែករបស់ខ្ញុំគឺប្លែកពីគេ!' } },
  { name: 'Rithy K.', rating: 5, text: { en: 'Trustworthy and professional. Best place for fine jewelry in Phnom Penh.', km: 'គួរឱ្យទុកចិត្តនិងមានជំនាញវិជ្ជាជីវៈ។ កន្លែងល្អបំផុតសម្រាប់គ្រឿងអលង្ការល្អនៅភ្នំពេញ។' } },
  { name: 'Vannak T.', rating: 5, text: { en: 'Beautiful craftsmanship and fair pricing. Highly recommended!', km: 'ស្នាដៃដ៏ស្រស់ស្អាតនិងតម្លៃសមរម្យ។ សូមណែនាំយ៉ាងខ្លាំង!' } },
];

const trustSignals = [
  { icon: Gem, key: 'home.trust.gia', descKey: 'home.trust.gia_desc' },
  { icon: Star, key: 'home.trust.consultation', descKey: 'home.trust.consultation_desc' },
  { icon: Sparkles, key: 'home.trust.custom', descKey: 'home.trust.custom_desc' },
  { icon: ShieldCheck, key: 'home.trust.payment', descKey: 'home.trust.payment_desc' },
];

const certifications = [
  { icon: Award, label: 'GIA' },
  { icon: Gem, label: 'IGI' },
  { icon: ShieldCheck, label: 'BVRLA' },
  { icon: Star, label: 'ISO 9001' },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-100" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-5 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const { t, lang } = useLanguage();
  const { products, fetchProducts, loading } = useProductStore();
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    fetchProducts();
    document.title = 'CT Diamond Jewelry | Luxury Jewelry Phnom Penh';
  }, [fetchProducts]);

  const availableProducts = products.filter((p) => p.stock_status === 'AVAILABLE').slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[500px] max-h-[700px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/80 via-black/60 to-black/70 z-10" />
        <Image
          src="/images/hero-bg.svg"
          alt="CT Diamond Jewelry"
          fill
          className={`object-cover transition-opacity duration-700 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`}
          priority
          onLoad={() => setHeroLoaded(true)}
        />
        <div className="relative z-20 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="max-w-2xl">
              <div className="mb-6 inline-block bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/20">
                <Image
                  src="/images/logo.png"
                  alt="CT Diamond Jewelry"
                  width={220}
                  height={70}
                  className="h-14 w-auto object-contain brightness-0 invert"
                  priority
                />
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight mb-4 drop-shadow-lg">
                {t('home.hero.title')}
              </h1>
              <p
                className="text-lg md:text-xl text-white/90 mb-8 font-serif drop-shadow"
                style={lang === 'km' ? { wordSpacing: '0.1em' } : undefined}
              >
                {t('home.hero.subtitle')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/catalog">
                  <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg">
                    {t('home.hero.cta')}
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
                <Link href="/appointment">
                  <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
                    {t('home.hero.cta2')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustSignals.map((signal) => {
              const Icon = signal.icon;
              return (
                <div key={signal.key} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center shrink-0">
                    <Icon className="text-amber-700" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t(signal.key)}</p>
                    <p className="text-xs text-gray-500">{t(signal.descKey)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About / Brand Story */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-amber-100 to-amber-50">
            <Image
              src="/images/about-store.svg"
              alt="CT Diamond Craftsmanship"
              fill
              className="object-contain p-8"
            />
          </div>
          <div>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">{t('home.about.title')}</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {t('home.about.body')}
            </p>
            <Link href="/appointment">
              <Button className="bg-amber-700 hover:bg-amber-800 text-white">
                {t('home.about.cta')}
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50/80 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold text-gray-900">
              {t('home.featured')}
            </h2>
            <Link
              href="/catalog"
              className="flex items-center gap-1 text-sm text-amber-700 hover:text-amber-800 font-medium"
            >
              {t('catalog.title')} <ChevronRight size={16} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : availableProducts.length === 0 ? (
            <div className="text-center py-16">
              <Gem className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500 text-lg mb-2">{t('catalog.empty')}</p>
              <p className="text-gray-400 text-sm mb-6">{t('catalog.empty.desc')}</p>
              <Link href="/appointment">
                <Button variant="outline">{t('catalog.empty.cta')}</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {availableProducts.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-2xl font-serif font-bold text-gray-900 text-center mb-12">
          {t('home.testimonials.title')}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <StarRating rating={t.rating} />
              <p className="text-sm text-gray-600 mt-3 mb-4 leading-relaxed">
                &ldquo;{t.text[lang] || t.text.en}&rdquo;
              </p>
              <p className="text-sm font-semibold text-gray-900">&mdash; {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="bg-gray-50/80 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8">
            {t('home.cert.title')}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {certifications.map((cert) => {
              const Icon = cert.icon;
              return (
                <div key={cert.label} className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center">
                    <Icon className="text-amber-700" size={28} />
                  </div>
                  <span className="text-sm font-medium text-gray-600">{cert.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Store Info with Maps Embed */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="text-amber-700" size={28} />
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">
                {t('home.visit')}
              </h3>
              <a
                href="https://www.google.com/maps?ll=11.547908,104.902909&z=13&t=m&hl=en-US&gl=US&mapclient=embed&cid=5058729923754564393"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-600 hover:text-amber-700 transition-colors mb-4 leading-relaxed"
              >
                84 J Street 430, Sangkat Tumnup Teuk,<br />
                Khan Chamkar Mon, Phnom Penh 120102, Cambodia
              </a>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p className="flex items-center gap-2">
                  <Phone size={14} className="text-amber-600 shrink-0" />
                  {t('common.phone')}
                </p>
                <p className="flex items-center gap-2">
                  <Clock size={14} className="text-amber-600 shrink-0" />
                  {t('support.hours')}
                </p>
              </div>
              <a
                href="https://www.google.com/maps?ll=11.547908,104.902909&z=13&t=m&hl=en-US&gl=US&mapclient=embed&cid=5058729923754564393"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-700 text-white rounded-full hover:bg-amber-800 transition-colors text-sm font-medium"
              >
                <ExternalLink size={16} />
                {t('home.view_map')}
              </a>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-[350px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15635.525566174432!2d104.902909!3d11.547908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310951ef8e492f29%3A0x4634381038079b29!2sCT%20Diamond!5e0!3m2!1sen!2skh!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="CT Diamond Jewelry Location"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
