import { useState } from 'react';
import { useAuth } from '@/lib/auth';

export default function AdminLogin() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fn = mode === 'login' ? signIn : signUp;
    const { error } = await fn(email, password);
    setLoading(false);
    if (error) setError(error);
  };

  return (
    <div className="min-h-screen bg-[#050810] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[150px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl glass-gold flex items-center justify-center">
              <span className="text-gold-400 font-black text-xl">D</span>
            </div>
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Admin Dashboard</h1>
          <p className="text-white/40 text-sm">Dental Master Academy</p>
        </div>

        <div className="glass rounded-3xl p-8">
          <div className="flex gap-2 mb-6 p-1 glass rounded-xl">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'login' ? 'bg-gold-500/20 text-gold-300' : 'text-white/40 hover:text-white/70'
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'signup' ? 'bg-gold-500/20 text-gold-300' : 'text-white/40 hover:text-white/70'
              }`}
            >
              Créer un compte
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full glass rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:border-gold-500/50 focus:outline-none transition-colors"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full glass rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:border-gold-500/50 focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full magnetic-btn bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold text-base px-6 py-3.5 rounded-xl glow-gold disabled:opacity-50"
            >
              {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'Créer le compte'}
            </button>
          </form>

          <p className="text-white/30 text-xs text-center mt-6">
            {mode === 'login'
              ? "Accès réservé à l'administrateur."
              : 'Créez votre compte administrateur pour gérer le site.'}
          </p>
        </div>

        <a href="/" className="block text-center text-white/30 text-sm mt-6 hover:text-white/60 transition-colors">
          ← Retour au site
        </a>
      </div>
    </div>
  );
}
