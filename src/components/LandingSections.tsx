import type { SiteContent } from '@/lib/content';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Academies from '@/components/Academies';
import ProductShowcase from '@/components/ProductShowcase';
import AppPreview from '@/components/AppPreview';
import Benefits from '@/components/Benefits';
import Pricing from '@/components/Pricing';
import Comparison from '@/components/Comparison';
import FAQ from '@/components/FAQ';
import FinalCTA from '@/components/FinalCTA';
import StickyWhatsApp from '@/components/StickyWhatsApp';
import PurchaseForm from '@/components/PurchaseForm';

interface LandingSectionsProps {
  content?: SiteContent | null;
}

export default function LandingSections({ content }: LandingSectionsProps) {
  return (
    <>
      <Navbar content={content} />
      <main>
        <Hero content={content} />
        <Academies content={content} />
        <ProductShowcase content={content} />
        <AppPreview content={content} />
        <Benefits content={content} />
        <Pricing content={content} />
        <Comparison content={content} />
        <FAQ content={content} />
        {/* Purchase form section */}
        <section id="order" className="relative py-32 bg-radial-gold overflow-hidden">
          <div className="absolute inset-0 dot-grid opacity-10" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <span className="section-label">Commander</span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mt-4 mb-6">
                Obtenez Votre <span className="text-gradient-gold">Bibliothèque</span>
              </h2>
              <div className="line-gold w-32 mx-auto mb-6" />
              <p className="text-white/50 text-lg max-w-2xl mx-auto">
                Remplissez le formulaire ci-dessous et notre équipe vous contactera pour finaliser votre commande.
              </p>
            </div>
            <PurchaseForm content={content} />
          </div>
        </section>
        <FinalCTA content={content} />
      </main>
      <StickyWhatsApp content={content} />
    </>
  );
}
