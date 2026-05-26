'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Gem, Sparkles, Book, Heart, Diamond, Phone, ChevronDown, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

export default function GemstoneGuidePage() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: t('learn.gemstone.faq_hardest'),
      a: t('learn.gemstone.faq_hardest_desc'),
    },
    {
      q: t('learn.gemstone.faq_expensive'),
      a: t('learn.gemstone.faq_expensive_desc'),
    },
    {
      q: t('learn.gemstone.faq_lab'),
      a: t('learn.gemstone.faq_lab_desc'),
    },
    {
      q: t('learn.gemstone.faq_engagement_ring'),
      a: t('learn.gemstone.faq_engagement_ring_desc'),
    },
    {
      q: t('learn.gemstone.faq_care'),
      a: t('learn.gemstone.faq_care_desc'),
    },
  ];

  const gemstones = [
    {
      name: t('learn.gemstone.ruby_name'),
      color: t('learn.gemstone.ruby_color'),
      desc: t('learn.gemstone.ruby_desc'),
      colorClass: 'bg-red-100 text-red-700',
      hardness: t('learn.gemstone.ruby_hardness'),
    },
    {
      name: t('learn.gemstone.sapphire_name'),
      color: t('learn.gemstone.sapphire_color'),
      desc: t('learn.gemstone.sapphire_desc'),
      colorClass: 'bg-blue-100 text-blue-700',
      hardness: t('learn.gemstone.sapphire_hardness'),
    },
    {
      name: t('learn.gemstone.emerald_name'),
      color: t('learn.gemstone.emerald_color'),
      desc: t('learn.gemstone.emerald_desc'),
      colorClass: 'bg-emerald-100 text-emerald-700',
      hardness: t('learn.gemstone.emerald_hardness'),
    },
    {
      name: t('learn.gemstone.topaz_name'),
      color: t('learn.gemstone.topaz_color'),
      desc: t('learn.gemstone.topaz_desc'),
      colorClass: 'bg-orange-100 text-orange-700',
      hardness: t('learn.gemstone.topaz_hardness'),
    },
  ];

  useEffect(() => {
    document.title = t('learn.gemstone.document_title');
  }, []);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Gem className="text-amber-700" size={32} />
        </div>
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">{t('learn.gemstone.title')}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('learn.gemstone.subtitle')}
        </p>
      </div>

      {/* Our Gemstones */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <Gem className="text-amber-600" size={24} />
          <h2 className="text-2xl font-serif font-bold text-gray-900">{t('learn.gemstone.collection')}</h2>
        </div>
        <p className="text-gray-600 mb-8">
          {t('learn.gemstone.collection_desc')}
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {gemstones.map((stone) => (
            <div
              key={stone.name}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stone.colorClass}`}>
                  <Gem size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{stone.name}</h3>
                  <span className="text-xs text-gray-500">{stone.color}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">{stone.desc}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Diamond size={12} />
                  {t('learn.gemstone.hardness_label')}: {stone.hardness}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Choosing a Gemstone for an Engagement Ring */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="text-amber-600" size={24} />
          <h2 className="text-2xl font-serif font-bold text-gray-900">{t('learn.gemstone.engagement')}</h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-8">
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-amber-700 font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">{t('learn.gemstone.engagement_durability')}</h4>
                <p className="text-sm text-gray-600">
                  {t('learn.gemstone.engagement_durability_desc')}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-amber-700 font-bold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">{t('learn.gemstone.engagement_color')}</h4>
                <p className="text-sm text-gray-600">
                  {t('learn.gemstone.engagement_color_desc')}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-amber-700 font-bold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">{t('learn.gemstone.engagement_quality')}</h4>
                <p className="text-sm text-gray-600">
                  {t('learn.gemstone.engagement_quality_desc')}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-amber-700 font-bold text-sm">4</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">{t('learn.gemstone.engagement_setting')}</h4>
                <p className="text-sm text-gray-600">
                  {t('learn.gemstone.engagement_setting_desc')}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-amber-700 font-bold text-sm">5</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">{t('learn.gemstone.engagement_expert')}</h4>
                <p className="text-sm text-gray-600">
                  {t('learn.gemstone.engagement_expert_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gemstone Care */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="text-amber-600" size={24} />
          <h2 className="text-2xl font-serif font-bold text-gray-900">{t('learn.gemstone.care')}</h2>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <ul className="space-y-4">
            <li className="flex gap-4">
              <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-amber-700 text-xs font-bold">1</span>
              </span>
              <div>
                <strong className="text-gray-900">{t('learn.gemstone.care_know')}</strong>
                <p className="text-sm text-gray-600 mt-1">
                  {t('learn.gemstone.care_know_desc')}
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-amber-700 text-xs font-bold">2</span>
              </span>
              <div>
                <strong className="text-gray-900">{t('learn.gemstone.care_temperature')}</strong>
                <p className="text-sm text-gray-600 mt-1">
                  {t('learn.gemstone.care_temperature_desc')}
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-amber-700 text-xs font-bold">3</span>
              </span>
              <div>
                <strong className="text-gray-900">{t('learn.gemstone.care_cleaning')}</strong>
                <p className="text-sm text-gray-600 mt-1">
                  {t('learn.gemstone.care_cleaning_desc')}
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-amber-700 text-xs font-bold">4</span>
              </span>
              <div>
                <strong className="text-gray-900">{t('learn.gemstone.care_storage')}</strong>
                <p className="text-sm text-gray-600 mt-1">
                  {t('learn.gemstone.care_storage_desc')}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <HelpCircle className="text-amber-600" size={24} />
          <h2 className="text-2xl font-serif font-bold text-gray-900">{t('learn.gemstone.faq')}</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-medium text-gray-900 pr-4">{faq.q}</span>
                <ChevronDown
                  size={20}
                  className={`text-amber-600 shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <p className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-2xl p-8 md:p-12 text-center">
        <Phone className="text-amber-700 mx-auto mb-4" size={36} />
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">
          {t('learn.gemstone.cta')}
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-8">
          {t('learn.gemstone.cta_desc')}
        </p>
        <Link
          href="/appointment"
          className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 h-12 px-6 text-base bg-amber-700 hover:bg-amber-800 text-white shadow-md"
        >
          {t('learn.gemstone.cta_btn')}
        </Link>
      </section>
    </div>
  );
}
