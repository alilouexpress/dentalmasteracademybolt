import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth';
import { fetchSiteContent, type SiteContent } from '@/lib/content';
import { keyToSection } from '@/lib/sections';
import LandingSections from '@/components/LandingSections';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';

function getRoute(): string {
  const hash = window.location.hash.toLowerCase();
  if (hash === '#/admin' || hash === '#admin') return 'admin';
  // #/login is not a standalone route: it redirects to the auth system,
  // which shows the login form on the admin route when unauthenticated.
  if (hash === '#/login' || hash === '#login') return 'admin';
  if (hash === '#/preview' || hash === '#preview') return 'preview';
  return 'home';
}

function LandingPage() {
  const [content, setContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    if (content?.logo_image_url) {
      const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (link) link.href = content.logo_image_url;
    }
  }, [content]);

  useEffect(() => {
    const load = () => fetchSiteContent().then(setContent);
    load();

    const refresh = () => {
      if (document.visibilityState === 'visible') load();
    };
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);

    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') load();
    }, 10000);

    return () => {
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div id="top" className="min-h-screen bg-[#050810] text-white overflow-x-hidden">
      <LandingSections content={content} />
    </div>
  );
}

function highlightSection(key: string) {
  const sectionId = keyToSection(key);
  if (!sectionId) return;

  if (sectionId === 'navbar') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const el = document.getElementById(sectionId) as HTMLElement | null;
  if (!el) return;

  const prev = document.querySelector('.preview-highlight');
  if (prev && prev !== el) prev.classList.remove('preview-highlight');

  if (sectionId !== 'navbar' && sectionId !== 'sticky') {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  el.classList.add('preview-highlight');
  setTimeout(() => el.classList.remove('preview-highlight'), 4000);
}

const SECTION_IDS = [
  'navbar',
  'hero',
  'showcase',
  'application',
  'academies',
  'benefits',
  'comparison',
  'pricing',
  'faq',
  'final-cta',
  'order',
  'sticky',
];

function applySelection(sectionId: string | null) {
  const prev = document.querySelector('.preview-selected');
  if (prev) prev.classList.remove('preview-selected');
  if (!sectionId) return;
  const el = document.getElementById(sectionId) as HTMLElement | null;
  if (el) el.classList.add('preview-selected');
}

function PreviewPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchSiteContent().then(setContent);

    const handler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data;
      if (!data) return;
      if (data.type === 'preview-edit' && data.editMode === true) {
        setEditMode(true);
      }
      if (data.type === 'preview-content') {
        if (data.content) setContent(data.content);
        if (data.activeKey) {
          highlightSection(String(data.activeKey));
          applySelection(keyToSection(String(data.activeKey)));
        }
      }
    };

    const clickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.contains(target)) {
          const anchor = target.closest('a');
          if (anchor && (anchor.getAttribute('href') || '').startsWith('#')) {
            e.preventDefault();
          }
          window.parent.postMessage(
            { type: 'preview-select', sectionId: id },
            window.location.origin
          );
          applySelection(id);
          return;
        }
      }
    };

    window.addEventListener('message', handler);
    if (editMode) {
      window.addEventListener('click', clickHandler, true);
    }
    return () => {
      window.removeEventListener('message', handler);
      window.removeEventListener('click', clickHandler, true);
    };
  }, [editMode]);

  return (
    <div id="top" className="min-h-screen bg-[#050810] text-white overflow-x-hidden">
      {editMode && (
        <style>{`
          #navbar:hover, #hero:hover, #showcase:hover, #application:hover,
          #academies:hover, #benefits:hover, #comparison:hover, #pricing:hover,
          #faq:hover, #final-cta:hover, #order:hover, #sticky:hover {
            outline: 2px dashed rgba(232, 182, 48, 0.65);
            outline-offset: -2px;
          }
          .preview-selected {
            outline: 2px solid #e8b630 !important;
            outline-offset: -2px;
          }
        `}</style>
      )}
      <LandingSections content={content} />
    </div>
  );
}

function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <div className="text-white/40 text-sm">Chargement...</div>
      </div>
    );
  }

  if (!user) return <AdminLogin />;
  return <AdminDashboard />;
}

function AppContent() {
  const [route, setRoute] = useState(getRoute());

  useEffect(() => {
    const handler = () => setRoute(getRoute());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  if (route === 'admin') return <AdminRoute />;
  if (route === 'preview') return <PreviewPage />;
  return <LandingPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
