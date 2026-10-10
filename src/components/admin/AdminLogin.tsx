import React, { useState } from "react";
import { Lock, Loader2, AlertCircle } from "lucide-react";

export const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error === "admin login not configured" ? "Admin login belum dikonfigurasi di server." : "Password salah.");
      }
      window.location.href = "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <img src="/icon.svg" alt="Merantaw" className="w-10 h-10 rounded-xl" />
          <div>
            <h1 className="text-lg font-extrabold text-[#0F172A] tracking-tight">Merantaw Admin</h1>
            <p className="text-xs text-slate-500">Company profile CMS</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#192C56] focus:ring-2 focus:ring-[#192C56]/30 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-3 py-2.5 rounded-xl">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full py-3.5 text-sm font-bold text-white bg-[#192C56] hover:bg-[#233C70] disabled:opacity-60 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            {busy ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Memeriksa…</span>
              </>
            ) : (
              <span>Masuk</span>
            )}
          </button>
        </form>

        <a href="/" className="block text-center text-xs font-semibold text-slate-500 hover:text-[#192C56] mt-6 transition-colors">
          ← Kembali ke situs
        </a>
      </div>
    </div>
  );
};
