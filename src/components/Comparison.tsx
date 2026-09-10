import { useEffect, useRef, useState } from 'react';
import type { SiteContent } from '@/lib/content';
import { getText } from '@/lib/content';

interface ComparisonProps {
  content?: SiteContent | null;
}

export default function Comparison({ content }: ComparisonProps) {
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

  const features = Array.from({ length: 10 }, (_, i) => getText(content, `comp_feat_${i + 1}`));
  const tradTrue = [5, 6]; // 1-indexed: features where "Cours en Ligne" has a check

  return (
    <section ref={ref} id="comparison" className="relative py-32 bg-radial-blue overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <span className="section-label">{getText(content, 'comparison_label')}</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mt-4 mb-6">
            {getText(content, 'comparison_title_1')} <span className="text-white/40">{getText(content, 'comparison_title_2')}</span>
          </h2>
          <div className="line-blue w-32 mx-auto mb-6" />
        </div>

        <div className={`glass rounded-3xl overflow-hidden transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid grid-cols-3 gap-4 px-6 py-6 border-b border-white/10 bg-white/[0.02]">
            <div className="text-white/50 text-sm font-semibold uppercase tracking-wider">{getText(content, 'comparison_col_1')}</div>
            <div className="text-center">
              <span className="text-gradient-gold font-black text-lg">{getText(content, 'comparison_col_2')}</span>
            </div>
            <div className="text-center">
              <span className="text-white/40 font-bold text-lg">{getText(content, 'comparison_col_3')}</span>
            </div>
          </div>

          {features.map((feat, i) => (
            <div
              key={i}
              className={`grid grid-cols-3 gap-4 px-6 py-4 items-center transition-all duration-500 ${
                i % 2 === 0 ? 'bg-white/[0.01]' : ''
              } ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
              style={{ transitionDelay: `${0.1 + i * 0.05}s` }}
            >
              <div className="text-white/70 text-sm font-medium">{feat}</div>
              <div className="flex justify-center">
                <div className="w-7 h-7 rounded-full bg-green-500/15 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="flex justify-center">
                {tradTrue.includes(i + 1) ? (
                  <div className="w-7 h-7 rounded-full bg-green-500/15 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-red-500/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
