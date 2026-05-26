'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Circle, Sparkles, Gem, Book, Heart, Phone, ChevronDown, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

export default function GoldTypesPage() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = [
    {
      q: t('learn.gold.faq_durable_q'),
      a: t('learn.gold.faq_durable_a'),
    },
    {
      q: t('learn.gold.faq_maintenance_q'),
      a: t('learn.gold.faq_maintenance_a'),
    },
    {
      q: t('learn.gold.faq_italian_q'),
      a: t('learn.gold.faq_italian_a'),
    },
    {
      q: t('learn.gold.faq_daily_q'),
      a: t('learn.gold.faq_daily_a'),
    },
    {
      q: t('learn.gold.faq_clean_q'),
      a: t('learn.gold.faq_clean_a'),
    },
  ];

  useEffect(() => {
    document.title = `${t('learn.gold.title')} | CT Diamond Jewelry`;
  }, []);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Circle className="text-amber-700" size={32} />
        </div>
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">{t('learn.gold.title')}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('learn.gold.subtitle')}

        </p>
      </div>

      {/* Types of Gold */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <Gem className="text-amber-600" size={24} />
          <h2 className="text-2xl font-serif font-bold text-gray-900">{t('learn.gold.types')}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Yellow Gold */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <Circle className="text-yellow-700" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{t('learn.gold.yellow')}</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {t('learn.gold.yellow_desc')}


            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-yellow-50 text-yellow-800 px-2 py-1 rounded-full border border-yellow-200">{t('learn.gold.yellow_tag_1')}</span>
              <span className="text-xs bg-yellow-50 text-yellow-800 px-2 py-1 rounded-full border border-yellow-200">{t('learn.gold.yellow_tag_2')}</span>
              <span className="text-xs bg-yellow-50 text-yellow-800 px-2 py-1 rounded-full border border-yellow-200">{t('learn.gold.yellow_tag_3')}</span>
            </div>
          </div>

          {/* White Gold */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="text-gray-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{t('learn.gold.white')}</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {t('learn.gold.white_desc')}


            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-gray-50 text-gray-800 px-2 py-1 rounded-full border border-gray-200">{t('learn.gold.white_tag_1')}</span>
              <span className="text-xs bg-gray-50 text-gray-800 px-2 py-1 rounded-full border border-gray-200">{t('learn.gold.white_tag_2')}</span>
              <span className="text-xs bg-gray-50 text-gray-800 px-2 py-1 rounded-full border border-gray-200">{t('learn.gold.white_tag_3')}</span>
            </div>
          </div>

          {/* Rose Gold */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
              <Heart className="text-pink-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{t('learn.gold.rose')}</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {t('learn.gold.rose_desc')}


            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-pink-50 text-pink-800 px-2 py-1 rounded-full border border-pink-200">{t('learn.gold.rose_tag_1')}</span>
              <span className="text-xs bg-pink-50 text-pink-800 px-2 py-1 rounded-full border border-pink-200">{t('learn.gold.rose_tag_2')}</span>
              <span className="text-xs bg-pink-50 text-pink-800 px-2 py-1 rounded-full border border-pink-200">{t('learn.gold.rose_tag_3')}</span>
            </div>
          </div>

          {/* Italian Gold */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <Gem className="text-amber-700" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{t('learn.gold.italian')}</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {t('learn.gold.italian_desc')}


            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-amber-50 text-amber-800 px-2 py-1 rounded-full border border-amber-200">{t('learn.gold.italian_tag_1')}</span>
              <span className="text-xs bg-amber-50 text-amber-800 px-2 py-1 rounded-full border border-amber-200">{t('learn.gold.italian_tag_2')}</span>
              <span className="text-xs bg-amber-50 text-amber-800 px-2 py-1 rounded-full border border-amber-200">{t('learn.gold.italian_tag_3')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Karat Guide */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <Book className="text-amber-600" size={24} />
          <h2 className="text-2xl font-serif font-bold text-gray-900">{t('learn.gold.karat')}</h2>
        </div>
        <p className="text-gray-600 mb-8">
          {t('learn.gold.karat_intro')}

          </p>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <span className="text-3xl font-serif font-bold text-amber-700">24K</span>
            <p className="text-sm font-semibold text-gray-900 mt-2">{t('learn.gold.karat_24k_purity')}</p>
            <p className="text-xs text-gray-500 mt-1">
              {t('learn.gold.karat_24k_desc')}

              </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-6 text-center">
            <span className="text-3xl font-serif font-bold text-amber-700">22K</span>
            <p className="text-sm font-semibold text-gray-900 mt-2">{t('learn.gold.karat_22k_purity')}</p>
            <p className="text-xs text-gray-500 mt-1">
              {t('learn.gold.karat_22k_desc')}

              </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <span className="text-3xl font-serif font-bold text-amber-700">18K</span>
            <p className="text-sm font-semibold text-gray-900 mt-2">{t('learn.gold.karat_18k_purity')}</p>
            <p className="text-xs text-gray-500 mt-1">
              {t('learn.gold.karat_18k_desc')}

              </p>
          </div>
        </div>
      </section>

      {/* Care Guide */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="text-amber-600" size={24} />
          <h2 className="text-2xl font-serif font-bold text-gray-900">{t('learn.gold.care')}</h2>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <ul className="space-y-4">
            <li className="flex gap-4">
              <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-amber-700 text-xs font-bold">1</span>
              </span>
              <div>
                <strong className="text-gray-900">{t('learn.gold.care_scratches')}</strong>
                <p className="text-sm text-gray-600 mt-1">
                  {t('learn.gold.care_scratches_desc')}

                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-amber-700 text-xs font-bold">2</span>
              </span>
              <div>
                <strong className="text-gray-900">{t('learn.gold.care_chemicals')}</strong>
                <p className="text-sm text-gray-600 mt-1">
                  {t('learn.gold.care_chemicals_desc')}

                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-amber-700 text-xs font-bold">3</span>
              </span>
              <div>
                <strong className="text-gray-900">{t('learn.gold.care_cleaning')}</strong>
                <p className="text-sm text-gray-600 mt-1">
                  {t('learn.gold.care_cleaning_desc')}

                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-amber-700 text-xs font-bold">4</span>
              </span>
              <div>
                <strong className="text-gray-900">{t('learn.gold.care_maintenance')}</strong>
                <p className="text-sm text-gray-600 mt-1">
                  {t('learn.gold.care_maintenance_desc')}

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
          <h2 className="text-2xl font-serif font-bold text-gray-900">{t('learn.gold.faq')}</h2>
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
          {t('learn.gold.cta')}
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-8">
          {t('learn.gold.cta_desc')}

        </p>
        <Link
          href="/appointment"
          className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 h-12 px-6 text-base bg-amber-700 hover:bg-amber-800 text-white shadow-md"
        >
          {t('learn.gold.cta_btn')}
        </Link>
      </section>
    </div>
  );
}
