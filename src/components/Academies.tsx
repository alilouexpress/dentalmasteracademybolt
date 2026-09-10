import { useEffect, useRef, useState } from 'react';
import type { SiteContent } from '@/lib/content';
import { getText } from '@/lib/content';

interface AcademiesProps {
  content?: SiteContent | null;
}

export default function Academies({ content }: AcademiesProps) {
  const fallback = content?.academy_image_url || '/images/academies/ChatGPT_Image_26_juil._2026,_01_07_27.png';
  const academyImages = [
    content?.academy_image_1 || fallback,
    content?.academy_image_2 || fallback,
    content?.academy_image_3 || fallback,
    content?.academy_image_4 || fallback,
    content?.academy_image_5 || fallback,
    content?.academy_image_6 || fallback,
    content?.academy_image_7 || fallback,
    content?.academy_image_8 || fallback,
    content?.academy_image_9 || fallback,
    content?.academy_image_10 || fallback,
  ];

  const academies = Array.from({ length: 10 }, (_, i) => ({
    title: getText(content, `academy_${i + 1}_title`),
    description: getText(content, `academy_${i + 1}_desc`),
  }));

  return (
    <section id="academies" className="relative py-32 bg-radial-dark overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <span className="section-label">{getText(content, 'academies_label')}</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mt-4 mb-6">
            {getText(content, 'academies_title_1')} <span className="text-gradient-gold">{getText(content, 'academies_title_2')}</span>
          </h2>
          <div className="line-gold w-32 mx-auto mb-6" />
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            {getText(content, 'academies_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {academies.map((academy, i) => (
            <AcademyCard key={i} academy={academy} index={i} imageUrl={academyImages[i] || fallback} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface Academy {
  title: string;
  description: string;
}

function AcademyCard({ academy, index, imageUrl }: { academy: Academy; index: number; imageUrl: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group glass rounded-3xl overflow-hidden card-hover hover:border-medical-500/40 transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${(index % 3) * 0.1}s` }}
    >
      <div className="relative h-64 overflow-hidden">
        <img src={imageUrl} alt={academy.title} className="academy-img w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/40 to-transparent" />
        <div className="absolute bottom-4 left-4 text-6xl font-black text-white/10 leading-none">
          {String(index + 1).padStart(2, '0')}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-white font-bold text-lg mb-2 group-hover:text-gradient-gold transition-all">
          {academy.title}
        </h3>
        <p className="text-white/50 text-sm leading-relaxed">{academy.description}</p>

        <div className="flex items-center justify-end pt-4 mt-4 border-t border-white/5">
          <div className="w-9 h-9 rounded-full glass-gold flex items-center justify-center group-hover:bg-gold-500/20 transition-all duration-300">
            <svg className="w-4 h-4 text-gold-300 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
