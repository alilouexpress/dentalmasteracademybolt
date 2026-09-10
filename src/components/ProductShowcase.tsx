import { useEffect, useRef, useState } from 'react';
import type { SiteContent } from '@/lib/content';
import { getText } from '@/lib/content';

interface ShowcaseProps {
  content?: SiteContent | null;
}

export default function ProductShowcase({ content }: ShowcaseProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const offset = window.innerHeight - rect.top;
        setScrollY(offset * 0.05);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const pills = [
    getText(content, 'showcase_pill_1'),
    getText(content, 'showcase_pill_2'),
    getText(content, 'showcase_pill_3'),
    getText(content, 'showcase_pill_4'),
  ];

  return (
    <section id="showcase" ref={ref} className="relative py-32 bg-radial-blue overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-medical-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <span className="section-label">{getText(content, 'showcase_label')}</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mt-4 mb-6 leading-tight">
              {getText(content, 'showcase_title_1')} <br />
              <span className="text-gradient-blue">{getText(content, 'showcase_title_2')}</span>
            </h2>
            <div className="line-blue w-32 mb-6" />
            <p className="text-white/60 text-lg leading-relaxed mb-8">
              {getText(content, 'showcase_desc')}
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-3 mb-8">
              {pills.map((feat) => (
                <span key={feat} className="glass-blue rounded-full px-4 py-2 text-medical-300 text-sm font-medium">
                  {feat}
                </span>
              ))}
            </div>

            {/* Offline badge */}
            <div className="glass-gold rounded-2xl p-5 flex items-center gap-4 max-w-sm">
              <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-gold-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 5.636a9 9 0 1012.728 0M12 3v6" />
                </svg>
              </div>
              <div>
                <div className="text-white font-bold text-sm">{getText(content, 'showcase_badge_title')}</div>
                <div className="text-white/50 text-xs">{getText(content, 'showcase_badge_desc')}</div>
              </div>
            </div>
          </div>

          {/* Right: Product image */}
          <div
            className={`relative transition-all duration-1000 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
            style={{ transform: `translateY(${-scrollY}px)` }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-medical-500/20 to-gold-500/20 blur-3xl rounded-full" />

              <div className="relative glass rounded-3xl p-6 overflow-hidden">
                <img
                  src={content?.product_image_url || '/images/product/ChatGPT_Image_26_juil._2026,_01_05_56.png'}
                  alt="Disque dur SSD Dental Master Academy"
                  className="w-full h-auto rounded-2xl"
                />

                <div className="absolute top-8 right-8 glass-gold rounded-xl px-4 py-3 animate-float">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                    <span className="text-gold-300 text-xs font-bold tracking-wider uppercase">{getText(content, 'showcase_floating_badge')}</span>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white/5 to-transparent rounded-b-2xl" />
              </div>

              <div className="absolute -top-4 -left-4 w-3 h-3 rounded-full bg-medical-400 animate-float-slow" />
              <div className="absolute -bottom-4 -right-4 w-2 h-2 rounded-full bg-gold-400 animate-float" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
