import { useEffect, useRef, useState } from 'react';
import type { SiteContent } from '@/lib/content';
import { getText } from '@/lib/content';

interface HeroProps {
  content?: SiteContent | null;
}

interface CounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

function AnimatedCounter({ end, suffix = '', prefix = '', duration = 2000 }: CounterProps) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end, duration]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

type HeroMode = 'normal' | 'carousel' | 'video' | 'scroll';

export default function Hero({ content }: HeroProps) {
  const [scrollY, setScrollY] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const heroImage = content?.hero_image_url || '/images/hero/ChatGPT_Image_26_juil._2026,_01_41_15.png';
  const heroSubtitle = getText(content, 'hero_subtitle');
  const whatsappUrl = `https://wa.me/${content?.whatsapp_number || '213670491102'}`;

  const mode: HeroMode = (content?.hero_mode as HeroMode) || 'normal';
  const carouselImages: string[] = Array.isArray(content?.hero_carousel_images) ? content!.hero_carousel_images : [];
  const videoUrl = content?.hero_video_url || '';
  const overlayOpacity = content?.hero_overlay_opacity ?? 60;
  const zoom = content?.hero_zoom ?? 100;
  const zoomStyle = { transform: `scale(${zoom / 100})` };

  const heroTextEnabled = content?.hero_text_enabled ?? true;
  const heroTextColor = content?.hero_text_color || '#FFFFFF';
  const heroTextSize = content?.hero_text_size ?? 100;
  const isDefaultColor = heroTextColor.toUpperCase() === '#FFFFFF';
  const titleStyle = {
    color: heroTextColor,
    ...(isDefaultColor ? {} : { WebkitTextFillColor: heroTextColor, backgroundImage: 'none' }),
  } as React.CSSProperties;

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Carousel auto-advance
  useEffect(() => {
    if (mode !== 'carousel' || carouselImages.length <= 1) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [mode, carouselImages.length]);

  // Scroll mode: pick image based on scroll position
  const scrollIndex = mode === 'scroll' && carouselImages.length > 0
    ? Math.min(Math.floor((scrollY / window.innerHeight) * carouselImages.length), carouselImages.length - 1)
    : 0;

  const stats = [
    { value: 146, suffix: '', label: getText(content, 'hero_stat_1_label') },
    { value: 8, suffix: '', label: getText(content, 'hero_stat_2_label') },
    { value: 100, suffix: '+', label: getText(content, 'hero_stat_3_label') },
    { value: 100, suffix: '%', label: getText(content, 'hero_stat_4_label') },
  ];

  const renderBackground = () => {
    if (mode === 'video' && videoUrl) {
      return (
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <video
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain"
            style={{ ...zoomStyle, objectPosition: 'center top' }}
          />
        </div>
      );
    }

    if (mode === 'carousel' && carouselImages.length > 0) {
      return (
        <div className="absolute inset-0 z-0">
          {carouselImages.map((img, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{ opacity: i === carouselIndex ? 1 : 0 }}
            >
              <img src={img} alt={`Slide ${i + 1}`} className="w-full h-full object-cover" style={zoomStyle} />
            </div>
          ))}
        </div>
      );
    }

    if (mode === 'scroll' && carouselImages.length > 0) {
      return (
        <div className="absolute inset-0 z-0">
          {carouselImages.map((img, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === scrollIndex ? 1 : 0 }}
            >
              <img src={img} alt={`Scroll ${i + 1}`} className="w-full h-full object-cover" style={zoomStyle} />
            </div>
          ))}
        </div>
      );
    }

    // normal mode (default)
    return (
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 animate-ken-burns" style={{ transformOrigin: 'center center', transform: `scale(${zoom / 100})` }}>
          <img src={heroImage} alt="Dental Master Academy" className="w-full h-full object-cover" />
        </div>
      </div>
    );
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-start overflow-hidden">
      {/* Background */}
      {renderBackground()}

      {/* Multi-layer overlay */}
      <div className="absolute inset-0 z-10" style={{ backgroundColor: `rgba(5, 8, 16, ${overlayOpacity / 100})` }} />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#050810]/90 via-[#050810]/50 to-transparent" />

      {/* Parallax particles */}
      <div
        className="absolute inset-0 z-10 dot-grid opacity-20"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      />

      {/* Floating accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent z-20" />

      {/* Carousel indicators */}
      {mode === 'carousel' && carouselImages.length > 1 && (
        <div className="absolute top-1/2 right-8 z-30 flex flex-col gap-2 -translate-y-1/2">
          {carouselImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCarouselIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === carouselIndex ? 'bg-gold-400 scale-125' : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Content */}
      {heroTextEnabled && (
      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 pb-20 pt-32 w-full">
        {/* Badge */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
          <span className="badge badge-gold">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 inline-block animate-pulse" />
            {getText(content, 'hero_badge')}
          </span>
        </div>

        {/* Main headline */}
        <div className="animate-slide-up" style={{ animationDelay: '0.4s', opacity: 0, animationFillMode: 'forwards' }}>
          <h1
            className="font-display font-black leading-none tracking-tight mb-2 hero-title"
            style={{ '--hero-text-scale': heroTextSize / 100 } as React.CSSProperties}
          >
            <span className="block" style={titleStyle}>{getText(content, 'hero_title_1')}</span>
            <span className={`block ${isDefaultColor ? 'shimmer-text' : ''}`} style={titleStyle}>{getText(content, 'hero_title_2')}</span>
            <span className="block" style={titleStyle}>{getText(content, 'hero_title_3')}</span>
          </h1>
        </div>

        {/* Divider */}
        <div className="line-gold w-48 my-8 animate-fade-in" style={{ animationDelay: '0.7s', opacity: 0, animationFillMode: 'forwards' }} />

        {/* Subheadline */}
        <p
          className="text-white/70 text-lg sm:text-xl lg:text-2xl font-light max-w-2xl leading-relaxed animate-slide-up"
          style={{ animationDelay: '0.6s', opacity: 0, animationFillMode: 'forwards' }}
        >
          {heroSubtitle.includes('chirurgiens-dentistes francophones') ? (
            <>
              {heroSubtitle.replace('chirurgiens-dentistes francophones', '').trim()}{' '}
              <span className="text-white font-medium">chirurgiens-dentistes francophones</span>.
            </>
          ) : (
            heroSubtitle
          )}
        </p>

        {/* Stats */}
        <div
          className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl animate-slide-up"
          style={{ animationDelay: '0.8s', opacity: 0, animationFillMode: 'forwards' }}
        >
          {stats.map((stat, i) => (
            <div key={i} className="glass rounded-2xl p-5 text-center card-hover group" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="text-3xl sm:text-4xl font-black text-gradient-gold mb-1">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={2000 + i * 200} />
              </div>
              <div className="text-white/50 text-xs font-medium leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div
          className="mt-10 flex flex-col sm:flex-row gap-4 animate-slide-up"
          style={{ animationDelay: '1s', opacity: 0, animationFillMode: 'forwards' }}
        >
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="magnetic-btn inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-base px-8 py-4 rounded-2xl glow-green"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current flex-shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            {getText(content, 'hero_cta_1')}
          </a>
          <a
            href="#academies"
            className="magnetic-btn inline-flex items-center gap-3 glass text-white/80 font-semibold text-base px-8 py-4 rounded-2xl border border-white/10 hover:border-gold-500/40 hover:text-white transition-colors"
          >
            {getText(content, 'hero_cta_2')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </div>
      )}

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050810] to-transparent z-20" />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 animate-float">
        <span className="text-white/30 text-xs font-medium tracking-widest uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-gold-500/60 to-transparent" />
      </div>
    </section>
  );
}
