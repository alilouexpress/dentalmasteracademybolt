import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/lib/auth';
import {
  fetchSiteContent,
  updateSiteContent,
  uploadImage,
  fetchPurchases,
  updatePurchaseStatus,
  deletePurchase,
  type SiteContent,
  type PurchaseRequest,
  DEFAULT_TEXTS,
} from '@/lib/content';
import { api } from '@/lib/api';
import { SECTIONS, getSectionById, getFieldDefault, type FieldDef } from '@/lib/editor-sections';

type Tab = 'design' | 'images' | 'orders' | 'password';
type Device = 'desktop' | 'tablet' | 'mobile';

const DEVICE_WIDTHS: Record<Device, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '390px',
};

const ACADEMY_FIELDS: { key: keyof SiteContent; label: string }[] = [
  { key: 'academy_image_1', label: 'Académie 1' },
  { key: 'academy_image_2', label: 'Académie 2' },
  { key: 'academy_image_3', label: 'Académie 3' },
  { key: 'academy_image_4', label: 'Académie 4' },
  { key: 'academy_image_5', label: 'Académie 5' },
  { key: 'academy_image_6', label: 'Académie 6' },
  { key: 'academy_image_7', label: 'Académie 7' },
  { key: 'academy_image_8', label: 'Académie 8' },
  { key: 'academy_image_9', label: 'Académie 9' },
  { key: 'academy_image_10', label: 'Académie 10' },
];

function getFieldValue(content: SiteContent, key: string): string | number | boolean {
  const c = content as unknown as Record<string, unknown>;
  if (c[key] !== undefined) return c[key] as string | number | boolean;
  const fallback = getFieldDefault(key);
  if (fallback !== undefined) return fallback;
  return content.texts?.[key] ?? DEFAULT_TEXTS[key] ?? '';
}

function updateContent(content: SiteContent, key: string, value: string | number | boolean): SiteContent {
  const c = content as unknown as Record<string, unknown>;
  if (c[key] !== undefined) {
    return { ...content, [key]: value } as SiteContent;
  }
  return { ...content, texts: { ...(content.texts || {}), [key]: String(value) } };
}

export default function AdminDashboard() {
  const { signOut } = useAuth();
  const [tab, setTab] = useState<Tab>('design');
  const [content, setContent] = useState<SiteContent | null>(null);
  const [purchases, setPurchases] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedSection, setSelectedSection] = useState('hero');
  const [device, setDevice] = useState<Device>('desktop');
  const [panelView, setPanelView] = useState<'edit' | 'preview'>('edit');

  const previewFrameRef = useRef<HTMLIFrameElement>(null);
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data;
      if (!data || data.type !== 'preview-select') return;
      if (typeof data.sectionId === 'string') {
        setSelectedSection(data.sectionId);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [c, p] = await Promise.all([fetchSiteContent(), fetchPurchases()]);
    setContent(c);
    setPurchases(p);
    setLoading(false);
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const sendPreview = (nextContent: SiteContent, activeKey?: string) => {
    if (!previewFrameRef.current) return;
    if (previewTimer.current) clearTimeout(previewTimer.current);
    previewTimer.current = setTimeout(() => {
      previewFrameRef.current?.contentWindow?.postMessage(
        { type: 'preview-content', content: nextContent, activeKey },
        window.location.origin
      );
    }, 120);
  };

  const handlePreviewLoad = () => {
    previewFrameRef.current?.contentWindow?.postMessage(
      { type: 'preview-edit', editMode: true },
      window.location.origin
    );
    if (content) sendPreview(content);
  };

  const handleSelectSection = (id: string) => {
    setSelectedSection(id);
    if (!content) return;
    const def = getSectionById(id);
    if (def && def.fields.length) sendPreview(content, def.fields[0].key);
  };

  const handleChange = (key: string, value: string | number | boolean) => {
    if (!content) return;
    const next = updateContent(content, key, value);
    setContent(next);
    sendPreview(next);
  };

  const handleSaveContent = async () => {
    if (!content) return;
    setSaving(true);
    const { error } = await updateSiteContent(content);
    setSaving(false);
    if (error) showMessage('error', error);
    else showMessage('success', 'Contenu publié avec succès.');
  };

  const handleUpload = async (key: string, file: File) => {
    setSaving(true);
    const { url, error } = await uploadImage(file);
    setSaving(false);
    if (error) { showMessage('error', error); return; }
    if (url) {
      handleChange(key, url);
      showMessage('success', 'Fichier téléchargé. Cliquez sur Enregistrer pour publier.');
    }
  };

  const handleVideoUpload = async (file: File) => {
    setSaving(true);
    const { url, error } = await uploadImage(file);
    setSaving(false);
    if (error) { showMessage('error', error); return; }
    if (url) {
      handleChange('hero_video_url', url);
      showMessage('success', 'Vidéo téléchargée. Cliquez sur Enregistrer pour publier.');
    }
  };

  const handleCarouselUpload = async (file: File) => {
    setSaving(true);
    const { url, error } = await uploadImage(file);
    setSaving(false);
    if (error) { showMessage('error', error); return; }
    if (url && content) {
      const arr = Array.isArray(content.hero_carousel_images) ? [...content.hero_carousel_images] : [];
      arr.push(url);
      const next = { ...content, hero_carousel_images: arr };
      setContent(next);
      sendPreview(next);
      showMessage('success', 'Image ajoutée au carousel. Cliquez sur Enregistrer pour publier.');
    }
  };

  const handleCarouselRemove = (index: number) => {
    if (!content) return;
    const arr = Array.isArray(content.hero_carousel_images) ? [...content.hero_carousel_images] : [];
    arr.splice(index, 1);
    const next = { ...content, hero_carousel_images: arr };
    setContent(next);
    sendPreview(next);
  };

  const handleCarouselMove = (index: number, dir: -1 | 1) => {
    if (!content) return;
    const arr = Array.isArray(content.hero_carousel_images) ? [...content.hero_carousel_images] : [];
    const newIndex = index + dir;
    if (newIndex < 0 || newIndex >= arr.length) return;
    [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
    const next = { ...content, hero_carousel_images: arr };
    setContent(next);
    sendPreview(next);
  };

  const handleCarouselUrlChange = (index: number, url: string) => {
    if (!content) return;
    const arr = Array.isArray(content.hero_carousel_images) ? [...content.hero_carousel_images] : [];
    arr[index] = url;
    const next = { ...content, hero_carousel_images: arr };
    setContent(next);
    sendPreview(next);
  };

  const handleStatusChange = async (id: string, status: string) => {
    const { error } = await updatePurchaseStatus(id, status);
    if (error) showMessage('error', error);
    else loadData();
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm('Supprimer cette commande ?')) return;
    const { error } = await deletePurchase(id);
    if (error) showMessage('error', error);
    else loadData();
  };

  const pendingCount = purchases.filter((p) => p.status === 'pending').length;

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'design',
      label: 'Éditeur',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      ),
    },
    {
      id: 'images',
      label: 'Images',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'orders',
      label: 'Commandes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      id: 'password',
      label: 'Sécurité',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="text-gray-500 text-sm">Chargement...</div>
      </div>
    );
  }

  const sectionDef = getSectionById(selectedSection);

  return (
    <div className="h-screen bg-[#f0f2f5] flex flex-col overflow-hidden">
      {/* ============ HEADER ============ */}
      <header className="shrink-0 bg-white border-b border-gray-200 z-40 shadow-sm">
        <div className="h-16 px-4 flex items-center gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shrink-0">
              <span className="text-white font-black text-lg">D</span>
            </div>
            <div className="hidden md:block min-w-0">
              <div className="text-gray-900 font-bold text-sm truncate">Dental Master</div>
              <div className="text-gray-500 text-xs">Admin Dashboard</div>
            </div>
          </div>

          <nav className="flex-1 flex items-center gap-1 overflow-x-auto px-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  tab === item.id
                    ? 'bg-gold-500/10 text-gold-600 border border-gold-200'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.id === 'orders' && pendingCount > 0 && (
                  <span className="bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded-full font-bold">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-medium px-4 py-2.5 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
            >
              Voir le site
            </a>
            {(tab === 'design' || tab === 'images') && (
              <button
                onClick={handleSaveContent}
                disabled={saving}
                className="magnetic-btn bg-gradient-to-r from-gold-500 to-gold-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-gold-500/25 disabled:opacity-50 transition-shadow"
              >
                {saving ? 'Publication...' : 'Enregistrer'}
              </button>
            )}
            <button
              onClick={signOut}
              className="text-red-500 hover:text-red-600 text-xs font-medium py-2.5 px-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors border border-red-200"
            >
              <span className="hidden sm:inline">Déconnexion</span>
              <span className="sm:hidden">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast message */}
      {message && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl text-sm font-medium shadow-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* ============ SPLIT SCREEN EDITOR ============ */}
      {tab === 'design' && content && (
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
          {/* ---- LEFT PROPERTIES PANEL ---- */}
          <aside
            className={`${
              panelView === 'preview' ? 'hidden' : 'flex'
            } lg:flex flex-col w-full lg:w-[360px] xl:w-[400px] bg-white border-r border-gray-200 min-h-0`}
          >
            {/* Section chips */}
            <div className="shrink-0 border-b border-gray-100 p-3">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">
                Sections du site
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
                {SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectSection(s.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all ${
                      selectedSection === s.id
                        ? 'bg-gold-500 text-white border-gold-500 shadow-md shadow-gold-500/25'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gold-300 hover:text-gold-600'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        selectedSection === s.id ? 'bg-white' : 'bg-gold-400'
                      }`}
                    />
                    {s.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Properties */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {sectionDef ? (
                <div className="px-5 py-5 space-y-5">
                  <LogoManager
                    value={String(getFieldValue(content, 'logo_image_url') || '')}
                    onUpload={(f) => handleUpload('logo_image_url', f)}
                    onUrlChange={(v) => handleChange('logo_image_url', v)}
                    onClear={() => handleChange('logo_image_url', '')}
                  />

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{sectionDef.title}</h2>
                      <p className="text-gray-500 text-sm mt-0.5">{sectionDef.subtitle}</p>
                    </div>
                    <button
                      onClick={() => handleSelectSection(selectedSection)}
                      className="text-gray-400 hover:text-gold-600 p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                      title="Repérer cette section dans l'aperçu"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>

                  <div className="rounded-2xl bg-blue-50 border border-blue-100 p-3.5 text-xs text-blue-700 leading-relaxed">
                    Les changements s'appliquent en temps réel dans l'aperçu à droite. Cliquez sur{' '}
                    <span className="font-bold">Enregistrer</span> pour publier sur le site.
                  </div>

                  {sectionDef.fields.map((field) => (
                    <FieldRenderer
                      key={field.key}
                      def={field}
                      content={content}
                      onChange={handleChange}
                      onUpload={handleUpload}
                      onCarouselAdd={handleCarouselUpload}
                      onCarouselRemove={handleCarouselRemove}
                      onCarouselMove={handleCarouselMove}
                      onCarouselUrlChange={handleCarouselUrlChange}
                    />
                  ))}

                  <button
                    onClick={handleSaveContent}
                    disabled={saving}
                    className="w-full magnetic-btn bg-gradient-to-r from-gold-500 to-gold-600 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-gold-500/25 disabled:opacity-50 transition-shadow"
                  >
                    {saving ? 'Publication...' : 'Enregistrer les modifications'}
                  </button>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500 text-sm">
                  Sélectionnez une section pour la modifier.
                </div>
              )}
            </div>
          </aside>

          {/* ---- RIGHT LIVE PREVIEW ---- */}
          <main
            className={`${
              panelView === 'edit' ? 'hidden' : 'flex'
            } lg:flex flex-col flex-1 min-w-0 min-h-0 bg-[#dfe3ea]`}
          >
            {/* Preview toolbar */}
            <div className="shrink-0 h-12 bg-white border-b border-gray-200 flex items-center gap-1 px-3">
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                {([
                  ['desktop', 'Desktop', 'M4 6h16v12H4z'],
                  ['tablet', 'Tablette', 'M12 18h.01M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z'],
                  ['mobile', 'Mobile', 'M12 18h.01M8 2h8a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2V4a2 2 0 012-2z'],
                ] as [Device, string, string][]).map(([value, label, d]) => (
                  <button
                    key={value}
                    onClick={() => setDevice(value)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      device === value
                        ? 'bg-white text-gold-600 shadow-sm border border-gray-200'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    title={label}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={d} />
                    </svg>
                    <span className="hidden md:inline">{label}</span>
                  </button>
                ))}
              </div>
              <div className="flex-1" />
              <span className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 mr-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Aperçu en direct
              </span>
              <a
                href={`${window.location.origin}/#/preview`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gold-600 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ouvrir dans un onglet
              </a>
            </div>

            {/* Preview frame */}
            <div className="flex-1 min-h-0 overflow-auto p-4">
              <div
                className="h-full mx-auto transition-all duration-300"
                style={{ width: DEVICE_WIDTHS[device], maxWidth: '100%' }}
              >
                <iframe
                  ref={previewFrameRef}
                  src={`${window.location.origin}/#/preview`}
                  onLoad={handlePreviewLoad}
                  className="w-full h-full rounded-xl border border-gray-300 bg-white shadow-2xl"
                  title="Aperçu en direct du site"
                />
              </div>
            </div>
          </main>
        </div>
      )}

      {/* ============ FULL WIDTH TABS ============ */}
      {tab !== 'design' && (
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          {tab === 'images' && content && (
            <div className="space-y-8 max-w-5xl">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Images & Photos</h2>
                <p className="text-gray-500 text-sm mt-1">Modifiez toutes les images de votre site.</p>
              </div>

              <Section title="Réglages Généraux">
                <div className="grid lg:grid-cols-2 gap-5">
                  <Field label="Prix SSD">
                    <input type="text" value={getFieldValue(content, 'price_ssd') as string} onChange={(e) => handleChange('price_ssd', e.target.value)} className="input-field" />
                  </Field>
                  <Field label="Prix Installation">
                    <input type="text" value={getFieldValue(content, 'price_install') as string} onChange={(e) => handleChange('price_install', e.target.value)} className="input-field" />
                  </Field>
                  <Field label="Numéro WhatsApp">
                    <input type="text" value={getFieldValue(content, 'whatsapp_number') as string} onChange={(e) => handleChange('whatsapp_number', e.target.value)} className="input-field" />
                  </Field>
                  <Field label="Titre du CTA Final">
                    <input type="text" value={getFieldValue(content, 'final_cta_title') as string} onChange={(e) => handleChange('final_cta_title', e.target.value)} className="input-field" />
                  </Field>
                </div>
              </Section>

              <Section title="Arrière-plan de la Section Hero">
                <div className="space-y-5">
                  <Field label="Mode d'arrière-plan">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                        { value: 'normal', label: 'Photo unique', desc: 'Une seule image fixe' },
                        { value: 'carousel', label: 'Carousel', desc: 'Plusieurs images qui défilent automatiquement' },
                        { value: 'video', label: 'Vidéo', desc: 'Vidéo en arrière-plan' },
                        { value: 'scroll', label: 'Au scroll', desc: 'Une image différente à chaque section défilée' },
                      ].map((m) => (
                        <button
                          key={m.value}
                          onClick={() => handleChange('hero_mode', m.value)}
                          className={`text-left p-4 rounded-xl border-2 transition-all ${
                            (getFieldValue(content, 'hero_mode') || 'normal') === m.value
                              ? 'border-gold-500 bg-gold-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <span className={`font-bold text-sm block ${(getFieldValue(content, 'hero_mode') || 'normal') === m.value ? 'text-gold-700' : 'text-gray-900'}`}>{m.label}</span>
                          <span className="text-gray-500 text-xs">{m.desc}</span>
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field label="Opacité de l'arrière-plan (assombrissement)">
                    <div className="flex items-center gap-4">
                      <input
                        type="range" min={0} max={100} step={5}
                        value={Number(getFieldValue(content, 'hero_overlay_opacity')) || 60}
                        onChange={(e) => handleChange('hero_overlay_opacity', parseInt(e.target.value))}
                        className="flex-1 accent-gold-500"
                      />
                      <span className="text-gray-700 font-bold text-sm w-12 text-right">{Number(getFieldValue(content, 'hero_overlay_opacity')) || 60}%</span>
                    </div>
                    <p className="text-gray-400 text-xs mt-2">0% = aucune couche sombre, 100% = images totalement assombries.</p>
                  </Field>

                  <Field label="Zoom sur les images d'arrière-plan">
                    <div className="flex items-center gap-4">
                      <input
                        type="range" min={100} max={200} step={5}
                        value={Number(getFieldValue(content, 'hero_zoom')) || 100}
                        onChange={(e) => handleChange('hero_zoom', parseInt(e.target.value))}
                        className="flex-1 accent-gold-500"
                      />
                      <span className="text-gray-700 font-bold text-sm w-12 text-right">{Number(getFieldValue(content, 'hero_zoom')) || 100}%</span>
                    </div>
                    <p className="text-gray-400 text-xs mt-2">100% = taille normale, 200% = zoom x2.</p>
                  </Field>

                  {(getFieldValue(content, 'hero_mode') || 'normal') === 'normal' && (
                    <ImageField
                      label="Image Hero (mode photo unique)"
                      url={getFieldValue(content, 'hero_image_url') as string}
                      onUpload={(f) => handleUpload('hero_image_url', f)}
                      onUrlChange={(v) => handleChange('hero_image_url', v)}
                    />
                  )}

                  {(getFieldValue(content, 'hero_mode') || 'normal') === 'video' && (
                    <Field label="Vidéo en arrière-plan">
                      {getFieldValue(content, 'hero_video_url') ? (
                        <div className="bg-gray-100 rounded-xl p-3 mb-3">
                          <video src={getFieldValue(content, 'hero_video_url') as string} autoPlay loop muted playsInline className="w-full max-h-40 rounded-lg object-cover" />
                        </div>
                      ) : null}
                      <label className="cursor-pointer block">
                        <span className="block text-center bg-blue-50 text-blue-600 text-sm font-medium py-3 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">{getFieldValue(content, 'hero_video_url') ? 'Remplacer la vidéo' : 'Télécharger une vidéo'}</span>
                        <input type="file" accept="video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleVideoUpload(f); }} />
                      </label>
                      <input type="text" value={getFieldValue(content, 'hero_video_url') as string} onChange={(e) => handleChange('hero_video_url', e.target.value)} className="input-field text-xs mt-3" placeholder="Ou collez une URL de vidéo (.mp4)" />
                    </Field>
                  )}

                  {((getFieldValue(content, 'hero_mode') || 'normal') === 'carousel' || getFieldValue(content, 'hero_mode') === 'scroll') && (
                    <div>
                      <label className="block text-gray-600 text-xs font-semibold mb-2 uppercase tracking-wider">
                        Images ({getFieldValue(content, 'hero_mode') === 'scroll' ? 'mode scroll' : 'mode carousel'})
                      </label>
                      <div className="space-y-3">
                        {(Array.isArray(content.hero_carousel_images) ? content.hero_carousel_images : []).map((img, i) => (
                          <div key={i} className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                            <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <img src={img} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                            </div>
                            <input type="text" value={img} onChange={(e) => handleCarouselUrlChange(i, e.target.value)} className="input-field text-xs flex-1" />
                            <div className="flex gap-1 flex-shrink-0">
                              <button onClick={() => handleCarouselMove(i, -1)} className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Monter">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                              </button>
                              <button onClick={() => handleCarouselMove(i, 1)} className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Descendre">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                              </button>
                              <button onClick={() => handleCarouselRemove(i)} className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors" aria-label="Supprimer">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </div>
                          </div>
                        ))}
                        <label className="cursor-pointer block">
                          <span className="block text-center bg-blue-50 text-blue-600 text-sm font-medium py-3 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">+ Ajouter une image</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCarouselUpload(f); }} />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </Section>

              <Section title="Images du Site">
                <div className="grid lg:grid-cols-2 gap-5">
                  <ImageField label="Logo du Site" url={getFieldValue(content, 'logo_image_url') as string} onUpload={(f) => handleUpload('logo_image_url', f)} onUrlChange={(v) => handleChange('logo_image_url', v)} />
                  <ImageField label="Image Hero" url={getFieldValue(content, 'hero_image_url') as string} onUpload={(f) => handleUpload('hero_image_url', f)} onUrlChange={(v) => handleChange('hero_image_url', v)} />
                  <ImageField label="Image Produit (SSD)" url={getFieldValue(content, 'product_image_url') as string} onUpload={(f) => handleUpload('product_image_url', f)} onUrlChange={(v) => handleChange('product_image_url', v)} />
                  <ImageField label="Image Application 1" url={getFieldValue(content, 'app_image_1_url') as string} onUpload={(f) => handleUpload('app_image_1_url', f)} onUrlChange={(v) => handleChange('app_image_1_url', v)} />
                  <ImageField label="Image Application 2" url={getFieldValue(content, 'app_image_2_url') as string} onUpload={(f) => handleUpload('app_image_2_url', f)} onUrlChange={(v) => handleChange('app_image_2_url', v)} />
                </div>
              </Section>

              <Section title="Photos des 10 Académies">
                <p className="text-gray-500 text-xs mb-4">Téléchargez une photo différente pour chaque académie.</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {ACADEMY_FIELDS.map((field) => (
                    <ImageField key={field.key} label={field.label} url={getFieldValue(content, field.key as string) as string} onUpload={(f) => handleUpload(field.key as string, f)} onUrlChange={(v) => handleChange(field.key as string, v)} compact />
                  ))}
                </div>
              </Section>
            </div>
          )}

          {tab === 'orders' && (
            <div className="space-y-4 max-w-5xl">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Commandes</h2>
                <p className="text-gray-500 text-sm mt-1">{purchases.length} commande(s) au total.</p>
              </div>
              {purchases.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-500 text-sm shadow-sm">Aucune commande pour le moment.</div>
              ) : (
                purchases.map((p) => (
                  <div key={p.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-900 font-bold text-base">{p.full_name}</span>
                          <StatusBadge status={p.status} />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1 text-sm">
                          <InfoLine label="Email" value={p.email} />
                          <InfoLine label="Téléphone" value={p.phone} />
                          <InfoLine label="Pays" value={p.country || '—'} />
                          <InfoLine label="Spécialité" value={p.specialty || '—'} />
                          <InfoLine label="Formule" value={p.plan === 'ssd' ? 'Disque SSD' : 'Installation'} />
                          <InfoLine label="Date" value={new Date(p.created_at).toLocaleDateString('fr-FR')} />
                        </div>
                        {p.message && <p className="text-gray-600 text-sm pt-2 border-t border-gray-100 mt-2">{p.message}</p>}
                      </div>
                      <div className="flex flex-col gap-2 min-w-[160px]">
                        <select value={p.status} onChange={(e) => handleStatusChange(p.id, e.target.value)} className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-gold-500 transition-colors">
                          <option value="pending">En attente</option>
                          <option value="confirmed">Confirmée</option>
                          <option value="completed">Terminée</option>
                          <option value="cancelled">Annulée</option>
                        </select>
                        <button onClick={() => handleDeleteOrder(p.id)} className="text-red-500 hover:text-red-600 text-xs font-medium py-2 transition-colors">Supprimer</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'password' && <PasswordChange onMessage={showMessage} />}
        </div>
      )}

      {/* Mobile segmented control */}
      {tab === 'design' && (
        <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-white border border-gray-200 rounded-full shadow-lg flex p-1">
          <button
            onClick={() => setPanelView('edit')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              panelView === 'edit' ? 'bg-gold-500 text-white' : 'text-gray-500'
            }`}
          >
            Propriétés
          </button>
          <button
            onClick={() => setPanelView('preview')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              panelView === 'preview' ? 'bg-gold-500 text-white' : 'text-gray-500'
            }`}
          >
            Aperçu
          </button>
        </div>
      )}
    </div>
  );
}

/* ============================================================ */
/* Field renderers                                               */
/* ============================================================ */

function LogoManager({
  value,
  onUpload,
  onUrlChange,
  onClear,
}: {
  value: string;
  onUpload: (file: File) => void;
  onUrlChange: (url: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="bg-white border-2 border-dashed border-gold-200 rounded-2xl p-4 space-y-3">
      <div>
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-4 h-4 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 6h16M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Logo du site
        </h3>
        <p className="text-gray-500 text-xs mt-0.5">Visible dans la barre de navigation.</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-36 h-16 rounded-xl border border-gray-200 bg-gray-50 grid place-items-center shrink-0 overflow-hidden shadow-inner">
          {value ? (
            <img src={value} alt="Logo" className="max-h-11 max-w-32 object-contain" />
          ) : (
            <div className="flex items-center gap-1.5 px-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shrink-0">
                <span className="text-white font-black text-xs">D</span>
              </div>
              <div className="leading-none">
                <span className="block text-gray-900 font-bold text-[10px] tracking-wide">DENTAL MASTER</span>
                <span className="block text-gold-500 text-[8px] font-semibold tracking-[0.15em] uppercase">Academy</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <label className="cursor-pointer block">
            <span className="block text-center bg-blue-50 text-blue-600 text-xs font-medium py-2.5 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">
              {value ? 'Remplacer le logo' : 'Télécharger un logo'}
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); }} />
          </label>
          {value && (
            <button
              onClick={onClear}
              className="w-full text-center text-red-500 hover:text-red-600 text-xs font-medium py-2.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
            >
              Rétablir le logo par défaut
            </button>
          )}
        </div>
      </div>
      <div>
        <input type="text" value={value} onChange={(e) => onUrlChange(e.target.value)} className="input-field text-xs" placeholder="URL du logo" />
      </div>
      {!value && (
        <p className="text-gray-400 text-xs">Aucun logo : le site affiche le logo texte « DENTAL MASTER » par défaut.</p>
      )}
    </div>
  );
}

interface FieldRendererProps {
  def: FieldDef;
  content: SiteContent;
  onChange: (key: string, value: string | number | boolean) => void;
  onUpload: (key: string, file: File) => void;
  onCarouselAdd: (file: File) => void;
  onCarouselRemove: (index: number) => void;
  onCarouselMove: (index: number, dir: -1 | 1) => void;
  onCarouselUrlChange: (index: number, url: string) => void;
}

function FieldRenderer({ def, content, onChange, onUpload, onCarouselAdd, onCarouselRemove, onCarouselMove, onCarouselUrlChange }: FieldRendererProps) {
  if (def.show && content && !def.show(content)) return null;
  const value = getFieldValue(content, def.key);

  switch (def.type) {
    case 'toggle':
      return <FieldToggle def={def} value={value} onChange={onChange} />;
    case 'color':
      return <FieldColor def={def} value={value} onChange={onChange} />;
    case 'range':
      return <FieldRange def={def} value={value} onChange={onChange} />;
    case 'select':
      return <FieldSelect def={def} value={value} onChange={onChange} />;
    case 'image':
      return <FieldImage def={def} value={value} onChange={onChange} onUpload={onUpload} />;
    case 'video':
      return <FieldVideo def={def} value={value} onChange={onChange} onUpload={onUpload} />;
    case 'carousel':
      return (
        <FieldCarousel
          images={Array.isArray(value) ? (value as string[]) : []}
          onAdd={onCarouselAdd}
          onRemove={onCarouselRemove}
          onMove={onCarouselMove}
          onUrlChange={onCarouselUrlChange}
        />
      );
    case 'textarea':
      return <FieldTextarea def={def} value={value} onChange={onChange} />;
    default:
      return <FieldText def={def} value={value} onChange={onChange} />;
  }
}

function FieldText({ def, value, onChange }: { def: FieldDef; value: string | number | boolean; onChange: (k: string, v: string | number | boolean) => void }) {
  return (
    <div>
      <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">{def.label}</label>
      <input type="text" value={String(value)} onChange={(e) => onChange(def.key, e.target.value)} className="input-field" placeholder={def.placeholder} />
      {def.hint && <p className="text-gray-400 text-xs mt-1.5">{def.hint}</p>}
    </div>
  );
}

function FieldTextarea({ def, value, onChange }: { def: FieldDef; value: string | number | boolean; onChange: (k: string, v: string | number | boolean) => void }) {
  return (
    <div>
      <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">{def.label}</label>
      <textarea value={String(value)} onChange={(e) => onChange(def.key, e.target.value)} rows={3} className="input-field resize-none" placeholder={def.placeholder} />
      {def.hint && <p className="text-gray-400 text-xs mt-1.5">{def.hint}</p>}
    </div>
  );
}

function FieldToggle({ def, value, onChange }: { def: FieldDef; value: string | number | boolean; onChange: (k: string, v: string | number | boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <label className="text-gray-700 text-sm font-medium">{def.label}</label>
      <button
        type="button"
        role="switch"
        aria-checked={!!value}
        onClick={() => onChange(def.key, !value)}
        className="toggle-switch"
      />
    </div>
  );
}

function FieldColor({ def, value, onChange }: { def: FieldDef; value: string | number | boolean; onChange: (k: string, v: string | number | boolean) => void }) {
  const current = String(value || '#FFFFFF');
  return (
    <div>
      <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">{def.label}</label>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {(def.colorOptions || []).map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onChange(def.key, color)}
              className={`color-swatch ${current === color ? 'selected' : ''}`}
              style={{ backgroundColor: color }}
              aria-label={`Couleur ${color}`}
            />
          ))}
          <label className="relative cursor-pointer">
            <span
              className="color-swatch"
              style={{ background: 'conic-gradient(#e8b630, #48d9fc, #22c55e, #f472b6, #e8b630)' }}
              title="Couleur personnalisée"
            />
            <input
              type="color"
              value={current}
              onChange={(e) => onChange(def.key, e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </label>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={current}
            onChange={(e) => onChange(def.key, e.target.value)}
            className="input-field text-xs flex-1"
          />
          <span
            className="w-10 h-10 rounded-xl border border-gray-200 flex-shrink-0 shadow-inner"
            style={{ backgroundColor: current }}
          />
        </div>
      </div>
    </div>
  );
}

function FieldRange({ def, value, onChange }: { def: FieldDef; value: string | number | boolean; onChange: (k: string, v: string | number | boolean) => void }) {
  const val = Number(value ?? def.min ?? 0);
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <label className="text-gray-600 text-xs font-semibold uppercase tracking-wider">{def.label}</label>
        <span className="text-gray-900 font-bold text-sm">
          {val}
          {def.unit || ''}
        </span>
      </div>
      <input
        type="range"
        min={def.min}
        max={def.max}
        step={def.step ?? 1}
        value={val}
        onChange={(e) => onChange(def.key, Number(e.target.value))}
        className="w-full accent-gold-500"
      />
      {def.hint && <p className="text-gray-400 text-xs mt-1.5">{def.hint}</p>}
    </div>
  );
}

function FieldSelect({ def, value, onChange }: { def: FieldDef; value: string | number | boolean; onChange: (k: string, v: string | number | boolean) => void }) {
  return (
    <div>
      <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">{def.label}</label>
      <select
        value={String(value)}
        onChange={(e) => onChange(def.key, e.target.value)}
        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-gold-500 transition-colors"
      >
        {(def.options || []).map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {def.hint && <p className="text-gray-400 text-xs mt-1.5">{def.hint}</p>}
    </div>
  );
}

function FieldImage({ def, value, onChange, onUpload }: { def: FieldDef; value: string | number | boolean; onChange: (k: string, v: string | number | boolean) => void; onUpload: (k: string, file: File) => void }) {
  return (
    <ImageField
      label={def.label}
      url={String(value || '')}
      onUpload={(f) => onUpload(def.key, f)}
      onUrlChange={(v) => onChange(def.key, v)}
    />
  );
}

function FieldVideo({ def, value, onChange, onUpload }: { def: FieldDef; value: string | number | boolean; onChange: (k: string, v: string | number | boolean) => void; onUpload: (k: string, file: File) => void }) {
  const url = String(value || '');
  return (
    <div>
      <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">{def.label}</label>
      {url && (
        <div className="bg-gray-100 rounded-xl p-3 mb-3">
          <video src={url} autoPlay loop muted playsInline className="w-full max-h-40 rounded-lg object-cover" />
        </div>
      )}
      <label className="cursor-pointer block">
        <span className="block text-center bg-blue-50 text-blue-600 text-sm font-medium py-3 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">{url ? 'Remplacer la vidéo' : 'Télécharger une vidéo'}</span>
        <input type="file" accept="video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(def.key, f); }} />
      </label>
      <input type="text" value={url} onChange={(e) => onChange(def.key, e.target.value)} className="input-field text-xs mt-3" placeholder="Ou collez une URL de vidéo (.mp4)" />
    </div>
  );
}

function FieldCarousel({ images, onAdd, onRemove, onMove, onUrlChange }: { images: string[]; onAdd: (file: File) => void; onRemove: (index: number) => void; onMove: (index: number, dir: -1 | 1) => void; onUrlChange: (index: number, url: string) => void }) {
  return (
    <div>
      <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">Images</label>
      <div className="space-y-3">
        {images.map((img, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3 shadow-sm">
            <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img src={img} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
            </div>
            <input type="text" value={img} onChange={(e) => onUrlChange(i, e.target.value)} className="input-field text-xs flex-1" />
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={() => onMove(i, -1)} className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Monter">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
              </button>
              <button onClick={() => onMove(i, 1)} className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Descendre">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <button onClick={() => onRemove(i)} className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors" aria-label="Supprimer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
        ))}
        <label className="cursor-pointer block">
          <span className="block text-center bg-blue-50 text-blue-600 text-sm font-medium py-3 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">+ Ajouter une image</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onAdd(f); }} />
        </label>
      </div>
    </div>
  );
}

/* ============================================================ */
/* Shared sub-components                                         */
/* ============================================================ */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
        <span className="w-1 h-5 bg-gold-500 rounded-full" />
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-gray-600 text-xs font-semibold mb-2 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-gray-400 text-xs min-w-[70px]">{label}:</span>
      <span className="text-gray-700 text-sm">{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    completed: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };
  const labels: Record<string, string> = {
    pending: 'En attente', confirmed: 'Confirmée', completed: 'Terminée', cancelled: 'Annulée',
  };
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${colors[status] || colors.pending}`}>{labels[status] || status}</span>;
}

function ImageField({ label, url, onUpload, onUrlChange, compact }: { label: string; url: string; onUpload: (file: File) => void; onUrlChange: (value: string) => void; compact?: boolean }) {
  return (
    <div>
      <label className="block text-gray-600 text-xs font-semibold mb-2 uppercase tracking-wider">{label}</label>
      <div className="bg-white border border-gray-200 rounded-xl p-3 space-y-3 shadow-sm">
        <div className={`${compact ? 'aspect-[4/3]' : 'aspect-video'} rounded-lg overflow-hidden bg-gray-100`}>
          <img src={url} alt={label} className="w-full h-full object-cover" />
        </div>
        <label className="cursor-pointer block">
          <span className="block text-center bg-blue-50 text-blue-600 text-xs font-medium py-2 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">Télécharger</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); }} />
        </label>
        <input type="text" value={url} onChange={(e) => onUrlChange(e.target.value)} className="input-field text-xs" placeholder="URL de l'image" />
      </div>
    </div>
  );
}

function PasswordChange({ onMessage }: { onMessage: (type: 'success' | 'error', text: string) => void }) {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirm) { onMessage('error', 'Les mots de passe ne correspondent pas.'); return; }
    if (newPass.length < 6) { onMessage('error', 'Le mot de passe doit contenir au moins 6 caractères.'); return; }
    setLoading(true);
    const { ok, error } = await api<{ ok: boolean }>('/api/auth/change-password', {
      method: 'POST',
      body: { currentPassword: currentPass, newPassword: newPass },
    });
    setLoading(false);
    if (!ok) onMessage('error', error || 'Erreur');
    else { onMessage('success', 'Mot de passe modifié avec succès.'); setCurrentPass(''); setNewPass(''); setConfirm(''); }
  };

  return (
    <div className="max-w-md space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Changer le mot de passe</h2>
        <p className="text-gray-500 text-sm mt-1">Mettez à jour votre mot de passe administrateur.</p>
      </div>
      <form onSubmit={handleChange} className="space-y-4">
        <Field label="Mot de passe actuel">
          <input type="password" value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} required className="input-field" placeholder="••••••••" />
        </Field>
        <Field label="Nouveau mot de passe">
          <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} required minLength={6} className="input-field" placeholder="••••••••" />
        </Field>
        <Field label="Confirmer le mot de passe">
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required className="input-field" placeholder="••••••••" />
        </Field>
        <button type="submit" disabled={loading} className="magnetic-btn bg-gradient-to-r from-gold-500 to-gold-600 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-gold-500/25 disabled:opacity-50 transition-shadow">
          {loading ? 'Modification...' : 'Changer le mot de passe'}
        </button>
      </form>
    </div>
  );
}
