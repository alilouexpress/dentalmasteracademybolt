import { useEffect, useRef, useState } from 'react';
import type { SiteContent } from '@/lib/content';
import { getText } from '@/lib/content';

interface BenefitsProps {
  content?: SiteContent | null;
}

export default function Benefits({ content }: BenefitsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const benefits = Array.from({ length: 8 }, (_, i) => ({
    num: String(i + 1).padStart(2, '0'),
    title: getText(content, `benefit_${i + 1}_title`),
    desc: getText(content, `benefit_${i + 1}_desc`),
  }));

  return (
    <section ref={ref} id="benefits" className="relative py-32 bg-radial-gold overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <span className="section-label">{getText(content, 'benefits_label')}</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mt-4 mb-6">
            {getText(content, 'benefits_title_1')} <span className="text-gradient-gold">{getText(content, 'benefits_title_2')}</span>
          </h2>
          <div className="line-gold w-32 mx-auto mb-6" />
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            {getText(content, 'benefits_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => (
            <div
              key={i}
              className={`group glass rounded-2xl p-6 card-hover hover:border-gold-500/30 transition-all duration-700 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${(i % 4) * 0.1}s` }}
            >
              <div className="text-5xl font-black text-gradient-gold opacity-30 group-hover:opacity-60 transition-opacity mb-3">
                {b.num}
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{b.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
