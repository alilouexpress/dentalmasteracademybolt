import { useEffect, useRef, useState } from 'react';
import type { SiteContent } from '@/lib/content';
import { getText } from '@/lib/content';

interface AppPreviewProps {
  content?: SiteContent | null;
}

export default function AppPreview({ content }: AppPreviewProps) {
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

  const feats = [
    { icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', label: getText(content, 'app_feat_1') },
    { icon: 'M4 6h16M4 10h16M4 14h16M4 18h16', label: getText(content, 'app_feat_2') },
    { icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z', label: getText(content, 'app_feat_3') },
    { icon: 'M5 13l4 4L19 7', label: getText(content, 'app_feat_4') },
  ];

  return (
    <section id="application" ref={ref} className="relative py-32 bg-radial-dark overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-label">{getText(content, 'app_label')}</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mt-4 mb-6">
            {getText(content, 'app_title_1')} <span className="text-gradient-blue">{getText(content, 'app_title_2')}</span>
          </h2>
          <div className="line-blue w-32 mx-auto mb-6" />
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            {getText(content, 'app_desc')}
          </p>
        </div>

        {/* App screenshots */}
        <div className={`grid md:grid-cols-2 gap-8 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Screenshot 1 */}
          <div className="group relative glass rounded-3xl overflow-hidden card-hover hover:border-medical-500/40">
            <img
              src={content?.app_image_1_url || '/images/application/ChatGPT_Image_26_juil._2026,_01_03_01_(1).png'}
              alt="Interface du logiciel - Dashboard"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050810]/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="badge badge-blue mb-2">{getText(content, 'app_shot1_badge')}</span>
              <h3 className="text-white font-bold text-xl">{getText(content, 'app_shot1_title')}</h3>
              <p className="text-white/50 text-sm mt-1">{getText(content, 'app_shot1_desc')}</p>
            </div>
          </div>

          {/* Screenshot 2 */}
          <div className="group relative glass rounded-3xl overflow-hidden card-hover hover:border-gold-500/40">
            <img
              src={content?.app_image_2_url || '/images/application/ChatGPT_Image_26_juil._2026,_01_03_01_(2).png'}
              alt="Interface du logiciel - Lecteur vidéo"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050810]/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="badge badge-gold mb-2">{getText(content, 'app_shot2_badge')}</span>
              <h3 className="text-white font-bold text-xl">{getText(content, 'app_shot2_title')}</h3>
              <p className="text-white/50 text-sm mt-1">{getText(content, 'app_shot2_desc')}</p>
            </div>
          </div>
        </div>

        {/* Feature row */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {feats.map((feat, i) => (
            <div
              key={i}
              className={`glass rounded-2xl p-5 text-center transition-all duration-700 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${0.3 + i * 0.1}s` }}
            >
              <div className="w-10 h-10 rounded-xl glass-blue flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-medical-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feat.icon} />
                </svg>
              </div>
              <span className="text-white/70 text-sm font-medium">{feat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
