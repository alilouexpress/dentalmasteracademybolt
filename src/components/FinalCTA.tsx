import { useEffect, useRef, useState } from 'react';
import type { SiteContent } from '@/lib/content';
import { getText } from '@/lib/content';

interface FinalCTAProps {
  content?: SiteContent | null;
}

export default function FinalCTA({ content }: FinalCTAProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const trustItems = [
    getText(content, 'final_trust_1'),
    getText(content, 'final_trust_2'),
    getText(content, 'final_trust_3'),
    getText(content, 'final_trust_4'),
  ];

  return (
    <section ref={ref} id="final-cta" className="relative py-40 overflow-hidden">
      <div className="absolute inset-0 bg-[#020408]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050810] via-[#020408] to-[#050810]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gold-500/5 rounded-full blur-[150px]" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-medical-500/5 rounded-full blur-[100px]" />
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 text-center">
        <div className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="section-label">{getText(content, 'final_cta_label')}</span>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mt-6 mb-8 leading-tight">
            {content?.final_cta_title || getText(content, 'final_cta_title')}
          </h2>

          <div className="line-gold w-48 mx-auto mb-10" />

          <p className="text-white/50 text-lg max-w-xl mx-auto mb-12">
            {getText(content, 'final_cta_desc')}
          </p>

          <a
            href={`https://wa.me/${content?.whatsapp_number || '213670491102'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="magnetic-btn inline-flex items-center gap-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg px-10 py-5 rounded-2xl glow-green animate-glow-pulse"
          >
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current flex-shrink-0">
              <path d="17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            {getText(content, 'final_cta_button')}
            <span className="text-white/70 text-sm font-medium">| {getText(content, 'final_cta_phone')}</span>
          </a>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-white/30 text-xs font-medium tracking-wider uppercase">
            {trustItems.map((item, i) => (
              <span key={i} className="flex items-center gap-6">
                {item}
                {i < trustItems.length - 1 && <span className="w-1 h-1 rounded-full bg-gold-500/40" />}
              </span>
            ))}
          </div>
        </div>
      </div>

      <footer className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 mt-32 pt-8 border-t border-white/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {content?.logo_image_url ? (
              <img src={content.logo_image_url} alt="Dental Master Academy" className="h-8 w-auto rounded object-contain" />
            ) : (
              <>
                <div className="w-8 h-8 rounded-lg glass-gold flex items-center justify-center">
                  <span className="text-gold-400 font-black text-sm">D</span>
                </div>
                <span className="text-white/40 text-sm font-medium">DENTAL MASTER ACADEMY</span>
              </>
            )}
          </div>
          <p className="text-white/30 text-xs">{getText(content, 'footer_address')}</p>
          <p className="text-white/20 text-xs">{getText(content, 'footer_copyright')}</p>
        </div>
      </footer>
    </section>
  );
}
