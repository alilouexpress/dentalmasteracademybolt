import { useState } from 'react';
import type { SiteContent } from '@/lib/content';
import { getText } from '@/lib/content';

interface FAQProps {
  content?: SiteContent | null;
}

export default function FAQ({ content }: FAQProps) {
  const [open, setOpen] = useState<number | null>(0);

  const faqs = Array.from({ length: 7 }, (_, i) => ({
    q: getText(content, `faq_${i + 1}_q`),
    a: getText(content, `faq_${i + 1}_a`),
  }));

  return (
    <section id="faq" className="relative py-32 bg-radial-dark overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-10" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-label">{getText(content, 'faq_label')}</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mt-4 mb-6">
            {getText(content, 'faq_title_1')} <span className="text-gradient-gold">{getText(content, 'faq_title_2')}</span>
          </h2>
          <div className="line-gold w-32 mx-auto mb-6" />
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`glass rounded-2xl overflow-hidden transition-all duration-300 ${
                open === i ? 'border-gold-500/30' : ''
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
              >
                <span className={`font-semibold text-base transition-colors ${open === i ? 'text-gold-300' : 'text-white/80'}`}>
                  {faq.q}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  open === i ? 'bg-gold-500/20 rotate-180' : 'glass-gold'
                }`}>
                  <svg className={`w-4 h-4 transition-colors ${open === i ? 'text-gold-300' : 'text-gold-400/60'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div className={`faq-content ${open === i ? 'open' : ''}`}>
                <p className="px-6 pb-5 text-white/50 text-sm leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
