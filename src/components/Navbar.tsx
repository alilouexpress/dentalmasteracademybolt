import { useEffect, useState } from 'react';
import type { SiteContent } from '@/lib/content';
import { getText } from '@/lib/content';

interface NavbarProps {
  content?: SiteContent | null;
}

export default function Navbar({ content }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { label: getText(content, 'nav_link_1'), href: '#academies' },
    { label: getText(content, 'nav_link_2'), href: '#showcase' },
    { label: getText(content, 'nav_link_3'), href: '#application' },
    { label: getText(content, 'nav_link_4'), href: '#pricing' },
    { label: getText(content, 'nav_link_5'), href: '#faq' },
  ];

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass py-3' : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-3 group">
          {content?.logo_image_url ? (
            <>
              <span className="h-11 rounded-xl overflow-hidden bg-white shadow-md border border-white/20 flex items-center flex-shrink-0">
                <img
                  src={content.logo_image_url}
                  alt={getText(content, 'nav_logo_title')}
                  className="h-full w-auto object-contain px-1.5"
                />
              </span>
              <span className="flex flex-col leading-none min-w-0">
                <span className="text-white font-bold text-sm tracking-wide truncate">{getText(content, 'nav_logo_title')}</span>
                <span className="text-gold-400/80 text-[10px] font-semibold tracking-[0.2em] uppercase truncate">{getText(content, 'nav_logo_sub')}</span>
              </span>
            </>
          ) : (
            <>
              <div className="relative w-10 h-10 rounded-xl glass-gold flex items-center justify-center overflow-hidden">
                <span className="text-gold-400 font-black text-lg">D</span>
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-transparent" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-bold text-sm tracking-wide">{getText(content, 'nav_logo_title')}</span>
                <span className="text-gold-400/80 text-[10px] font-semibold tracking-[0.2em] uppercase">{getText(content, 'nav_logo_sub')}</span>
              </div>
            </>
          )}
        </a>

        {/* Links */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-white/60 hover:text-white text-sm font-medium transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-gold-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </a>
          ))}
        </div>

        {/* Admin link */}
        <a
          href="#/admin"
          className="text-white/30 hover:text-white/60 text-xs font-medium transition-colors hidden lg:block"
        >
          {getText(content, 'nav_admin')}
        </a>

        {/* CTA */}
        <a
          href={`https://wa.me/${content?.whatsapp_number || '213670491102'}`}
          target="_blank"
          rel="noopener noreferrer"
          className="magnetic-btn inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl glow-green"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          <span className="hidden sm:inline">{getText(content, 'nav_cta')}</span>
        </a>
      </div>
    </nav>
  );
}
