import { useState } from 'react';
import { submitPurchaseRequest } from '@/lib/content';
import type { SiteContent } from '@/lib/content';
import { getText } from '@/lib/content';

interface PurchaseFormProps {
  content?: SiteContent | null;
}

export default function PurchaseForm({ content }: PurchaseFormProps) {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    country: '',
    specialty: '',
    plan: 'ssd',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    const { error } = await submitPurchaseRequest(form);
    if (error) {
      setStatus('error');
      setErrorMsg(error);
    } else {
      setStatus('success');
      setForm({
        full_name: '',
        email: '',
        phone: '',
        country: '',
        specialty: '',
        plan: 'ssd',
        message: '',
      });
    }
  };

  if (status === 'success') {
    return (
      <div className="glass rounded-3xl p-10 text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-white font-bold text-2xl mb-3">{getText(content, 'form_success_title')}</h3>
        <p className="text-white/50 text-sm mb-6">{getText(content, 'form_success_desc')}</p>
        <button
          onClick={() => setStatus('idle')}
          className="magnetic-btn glass-gold text-gold-300 font-semibold text-sm px-6 py-3 rounded-xl"
        >
          {getText(content, 'form_success_btn')}
        </button>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <span className="section-label">{getText(content, 'form_label')}</span>
        <h3 className="text-3xl font-black text-white mt-3 mb-3">
          {getText(content, 'form_title_1')} <span className="text-gradient-gold">{getText(content, 'form_title_2')}</span>
        </h3>
        <p className="text-white/50 text-sm">{getText(content, 'form_desc')}</p>
      </div>

      {status === 'error' && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm mb-6">
          {errorMsg || "Une erreur s'est produite. Veuillez réessayer."}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">Nom complet *</label>
            <input type="text" required value={form.full_name} onChange={(e) => handleChange('full_name', e.target.value)} className="input-field" placeholder="Dr. Jean Dupont" />
          </div>
          <div>
            <label className="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">Email *</label>
            <input type="email" required value={form.email} onChange={(e) => handleChange('email', e.target.value)} className="input-field" placeholder="dr.dupont@email.com" />
          </div>
          <div>
            <label className="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">Téléphone *</label>
            <input type="tel" required value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} className="input-field" placeholder="+213 6 70 49 11 02" />
          </div>
          <div>
            <label className="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">Pays</label>
            <input type="text" value={form.country} onChange={(e) => handleChange('country', e.target.value)} className="input-field" placeholder="Algérie" />
          </div>
        </div>

        <div>
          <label className="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">Spécialité</label>
          <input type="text" value={form.specialty} onChange={(e) => handleChange('specialty', e.target.value)} className="input-field" placeholder="Chirurgien-dentiste, implantologiste..." />
        </div>

        <div>
          <label className="block text-white/50 text-xs font-semibold mb-3 uppercase tracking-wider">Formule souhaitée</label>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className={`cursor-pointer glass rounded-xl p-4 border-2 transition-all ${form.plan === 'ssd' ? 'border-gold-500/50 bg-gold-500/5' : 'border-white/5'}`}>
              <input type="radio" name="plan" value="ssd" checked={form.plan === 'ssd'} onChange={(e) => handleChange('plan', e.target.value)} className="hidden" />
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white font-bold text-sm block">{getText(content, 'plan_ssd_name')}</span>
                  <span className="text-gold-300 text-xs">{content?.price_ssd || '19 900 DA'}</span>
                </div>
                {form.plan === 'ssd' && (
                  <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </label>
            <label className={`cursor-pointer glass rounded-xl p-4 border-2 transition-all ${form.plan === 'install' ? 'border-gold-500/50 bg-gold-500/5' : 'border-white/5'}`}>
              <input type="radio" name="plan" value="install" checked={form.plan === 'install'} onChange={(e) => handleChange('plan', e.target.value)} className="hidden" />
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white font-bold text-sm block">{getText(content, 'plan_install_name')}</span>
                  <span className="text-gold-300 text-xs">{content?.price_install || '14 900 DA'}</span>
                </div>
                {form.plan === 'install' && (
                  <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">Message (optionnel)</label>
          <textarea value={form.message} onChange={(e) => handleChange('message', e.target.value)} rows={3} className="input-field resize-none" placeholder="Une question ou précision ?" />
        </div>

        <button type="submit" disabled={status === 'submitting'} className="magnetic-btn w-full bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold text-base px-6 py-4 rounded-xl glow-gold disabled:opacity-50">
          {status === 'submitting' ? 'Envoi en cours...' : getText(content, 'form_btn')}
        </button>
        <p className="text-white/30 text-xs text-center">{getText(content, 'form_note')}</p>
      </form>
    </div>
  );
}
