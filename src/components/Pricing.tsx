import { useEffect, useRef, useState } from 'react';
import type { SiteContent } from '@/lib/content';
import { getText } from '@/lib/content';

interface PricingProps {
  content?: SiteContent | null;
}

export default function Pricing({ content }: PricingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const plans = [
    {
      name: getText(content, 'plan_ssd_name'),
      price: content?.price_ssd || '19 900 DA',
      badge: getText(content, 'plan_ssd_badge'),
      featured: true,
      features: Array.from({ length: 6 }, (_, i) => getText(content, `plan_ssd_feat_${i + 1}`)),
    },
    {
      name: getText(content, 'plan_install_name'),
      price: content?.price_install || '14 900 DA',
      badge: getText(content, 'plan_install_badge'),
      featured: false,
      features: Array.from({ length: 5 }, (_, i) => getText(content, `plan_install_feat_${i + 1}`)),
    },
  ];

  return (
    <section id="pricing" ref={ref} className="relative py-32 bg-radial-dark overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <span className="section-label">{getText(content, 'pricing_label')}</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mt-4 mb-6">
            {getText(content, 'pricing_title_1')} <span className="text-gradient-gold">{getText(content, 'pricing_title_2')}</span>
          </h2>
          <div className="line-gold w-32 mx-auto mb-6" />
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            {getText(content, 'pricing_desc')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-3xl p-8 transition-all duration-1000 ${
                plan.featured ? 'pricing-featured' : 'glass'
              } ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              <div className="flex items-center justify-between mb-6">
                <span className={`badge ${plan.featured ? 'badge-gold' : 'badge-blue'}`}>{plan.badge}</span>
                {plan.featured && (
                  <div className="w-10 h-10 rounded-xl bg-gold-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gold-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                )}
              </div>

              <h3 className="text-white font-bold text-xl mb-2">{plan.name}</h3>

              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-black text-gradient-gold">{plan.price}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      plan.featured ? 'bg-gold-500/20' : 'bg-medical-500/15'
                    }`}>
                      <svg className={`w-3 h-3 ${plan.featured ? 'text-gold-300' : 'text-medical-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-white/70 text-sm">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href={`https://wa.me/${content?.whatsapp_number || '213670491102'}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`magnetic-btn flex items-center justify-center gap-3 w-full font-bold text-base px-6 py-4 rounded-2xl transition-all ${
                  plan.featured
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black glow-gold hover:from-gold-400 hover:to-gold-500'
                    : 'glass-blue text-medical-300 hover:bg-medical-500/20'
                }`}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                {getText(content, 'pricing_cta')}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
