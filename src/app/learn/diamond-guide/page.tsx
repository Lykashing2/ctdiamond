'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Diamond, Sparkles, Shield, Book, HelpCircle, ChevronDown, Gem, Phone } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { Button } from '@/components/ui/Button';

const faqs = [
  {
    q: 'What is the most important of the 4Cs?',
    a: 'Cut is widely considered the most important because it determines how well a diamond reflects light. A well-cut diamond appears more brilliant even if its other grades are lower. However, all four factors work together to determine a diamond\'s overall beauty and value.',
  },
  {
    q: 'Does CT Diamond offer certified diamonds?',
    a: 'Yes, all of our diamonds are certified by internationally recognized gemological laboratories including GIA and IGI. We provide full certification documentation with every diamond purchase.',
  },
  {
    q: 'What is the difference between natural and lab-grown diamonds?',
    a: 'Natural diamonds are formed deep within the Earth over billions of years, while lab-grown diamonds are created in controlled laboratory environments. Both have the same chemical and physical properties. CT Diamond offers both options with full transparency.',
  },
  {
    q: 'How should I clean my diamond jewelry at home?',
    a: 'Soak your diamond jewelry in a solution of warm water and mild dish soap for 20-30 minutes, then gently brush with a soft toothbrush. Rinse with clean water and pat dry with a lint-free cloth. Avoid harsh chemicals and ultrasonic cleaners for heavily included stones.',
  },
  {
    q: 'Can I insure my diamond purchase from CT Diamond?',
    a: 'We recommend insuring all fine jewelry purchases. We provide detailed appraisals and certification documents that insurance companies require. Please speak with our team for insurance recommendations.',
  },
];

export default function DiamondGuidePage() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    document.title = t('learn.diamond.meta_title');
  }, []);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Diamond className="text-amber-700" size={32} />
        </div>
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">{t('learn.diamond.title')}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('learn.diamond.subtitle')}
        </p>
      </div>

      {/* 4Cs Section */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="text-amber-600" size={24} />
          <h2 className="text-2xl font-serif font-bold text-gray-900">{t('learn.diamond.four_cs')}</h2>
        </div>
        <p className="text-gray-600 mb-8">
          {t('learn.diamond.four_cs_intro')}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Cut */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <Gem className="text-amber-700" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{t('learn.diamond.cut')}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t('learn.diamond.cut_desc')}
            </p>
          </div>

          {/* Color */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <Diamond className="text-amber-700" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{t('learn.diamond.color')}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t('learn.diamond.color_desc')}
            </p>
          </div>

          {/* Clarity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="text-amber-700" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{t('learn.diamond.clarity')}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t('learn.diamond.clarity_desc')}
            </p>
          </div>

          {/* Carat */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <Gem className="text-amber-700" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{t('learn.diamond.carat')}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t('learn.diamond.carat_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Sourcing Standards */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="text-amber-600" size={24} />
          <h2 className="text-2xl font-serif font-bold text-gray-900">{t('learn.diamond.sourcing')}</h2>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-amber-700" size={28} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{t('learn.diamond.conflict_free')}</h4>
              <p className="text-sm text-gray-600">
                {t('learn.diamond.conflict_free_desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Book className="text-amber-700" size={28} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{t('learn.diamond.certified')}</h4>
              <p className="text-sm text-gray-600">
                {t('learn.diamond.certified_desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Diamond className="text-amber-700" size={28} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{t('learn.diamond.direct')}</h4>
              <p className="text-sm text-gray-600">
                {t('learn.diamond.direct_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Care Guide */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="text-amber-600" size={24} />
          <h2 className="text-2xl font-serif font-bold text-gray-900">{t('learn.diamond.care')}</h2>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <ul className="space-y-4">
            <li className="flex gap-4">
              <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-amber-700 text-xs font-bold">1</span>
              </span>
              <div>
                <strong className="text-gray-900">{t('learn.diamond.care_tip_1_title')}</strong>
                <p className="text-sm text-gray-600 mt-1">
                  {t('learn.diamond.care_tip_1_desc')}
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-amber-700 text-xs font-bold">2</span>
              </span>
              <div>
                <strong className="text-gray-900">{t('learn.diamond.care_tip_2_title')}</strong>
                <p className="text-sm text-gray-600 mt-1">
                  {t('learn.diamond.care_tip_2_desc')}
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-amber-700 text-xs font-bold">3</span>
              </span>
              <div>
                <strong className="text-gray-900">{t('learn.diamond.care_tip_3_title')}</strong>
                <p className="text-sm text-gray-600 mt-1">
                  {t('learn.diamond.care_tip_3_desc')}
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-amber-700 text-xs font-bold">4</span>
              </span>
              <div>
                <strong className="text-gray-900">{t('learn.diamond.care_tip_4_title')}</strong>
                <p className="text-sm text-gray-600 mt-1">
                  {t('learn.diamond.care_tip_4_desc')}
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
          <h2 className="text-2xl font-serif font-bold text-gray-900">{t('learn.diamond.faq')}</h2>
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
                <span className="font-medium text-gray-900 pr-4">{t('learn.diamond.faq_q_' + (index + 1))}</span>
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
                <p className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">{t('learn.diamond.faq_a_' + (index + 1))}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-2xl p-8 md:p-12 text-center">
        <Phone className="text-amber-700 mx-auto mb-4" size={36} />
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">
          {t('learn.diamond.cta')}
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-8">
          {t('learn.diamond.cta_desc')}
        </p>
        <Link href="/appointment">
          <Button size="lg" className="bg-amber-700 hover:bg-amber-800 text-white shadow-md">
            {t('learn.diamond.cta_btn')}
          </Button>
        </Link>
      </section>
    </div>
  );
}


