import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { studioInfo } from '../data/studioData';
import { useSite } from '../lib/cms';
import {
  Mail,
  MapPin,
  Globe,
  Copy,
  Check,
  Send,
  Sparkles,
  ExternalLink,
  Shield,
  Briefcase
} from 'lucide-react';

const ChannelsList: React.FC = () => {
  const site = useSite();
  const channels = site?.channels ?? [];
  const social = channels.filter((c) => !["email", "domain", "location"].includes(c.key));
  const fallback = [
    { key: "itch", value: studioInfo.channels.itch, label: "itch.io", isLink: true },
    { key: "github", value: studioInfo.channels.github, label: "GitHub", isLink: true },
    { key: "discord", value: "Discord (Verified on request)", label: "Discord", isLink: false },
    { key: "instagram", value: "Instagram (@merantaw)", label: "Instagram", isLink: false },
  ];
  const list = social.length ? social : fallback;
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      {list.map((c) =>
        c.isLink ? (
          <a
            key={c.key}
            href={c.value}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#192C56] text-slate-700 hover:text-[#192C56] font-semibold transition-all inline-flex items-center gap-1.5"
          >
            <span>{c.label}</span>
            <ExternalLink size={12} />
          </a>
        ) : (
          <span key={c.key} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500 font-mono text-[11px]">
            {c.value}
          </span>
        )
      )}
    </div>
  );
};

export const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(studioInfo.officialEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSendError("");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Gagal mengirim pesan.");
      }
      setSent(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      // Fallback: mailto so the inquiry is never lost
      const mailtoUrl = `mailto:${studioInfo.officialEmail}?subject=${encodeURIComponent(
        `[Merantaw Inquiry] ${formData.subject}`
      )}&body=${encodeURIComponent(
        `From: ${formData.name} (${formData.email})\n\n${formData.message}`
      )}`;
      setSendError(err instanceof Error ? err.message : "Gagal mengirim.");
      window.location.href = mailtoUrl;
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="scroll-mt-20 py-24 sm:py-32 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-bold tracking-widest text-[#192C56] uppercase font-mono">
            {t.contact.sectionTag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mt-2 mb-4">
            {t.contact.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {t.contact.subtitle}
          </p>
        </div>

        {/* Dual Audience Value Cards (Investors vs Public/Creative) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {/* Investor Audience Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#192C56] text-white shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none" />
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold tracking-wider uppercase mb-4">
                <Briefcase size={13} />
                <span>{t.contact.investorAudienceBadge}</span>
              </div>
              <h3 className="text-xl font-bold tracking-tight mb-2">
                Investment &amp; Co-Production
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed font-normal">
                {t.contact.investorAudienceText}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/15 flex items-center gap-2 text-xs text-slate-300 font-mono">
              <Shield size={14} className="text-emerald-400" />
              <span>NIB &amp; NPWP Registered · 4 IP Rights</span>
            </div>
          </div>

          {/* Public / Creative Audience Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF9F6] border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/80 text-slate-700 text-xs font-bold tracking-wider uppercase mb-4">
                <Sparkles size={13} className="text-[#192C56]" />
                <span>{t.contact.publicAudienceBadge}</span>
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] tracking-tight mb-2">
                Publishing &amp; Creative Exchange
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {t.contact.publicAudienceText}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span>Domain: {studioInfo.domain}</span>
            </div>
          </div>
        </div>

        {/* Contact Details & Inquiry Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Info & Channels */}
          <div className="lg:col-span-5 space-y-6">
            {/* Email Card */}
            <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-slate-200">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase block mb-1">
                {t.contact.emailLabel}
              </span>
              <div className="flex items-center justify-between gap-2 mt-2">
                <span className="text-base sm:text-lg font-bold text-[#192C56] font-mono break-all">
                  {studioInfo.officialEmail}
                </span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 hover:border-[#192C56] text-slate-700 hover:text-[#192C56] transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                  title="Copy email to clipboard"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-600" />
                      <span className="text-emerald-700">{t.contact.copiedEmail}</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>{t.contact.copyEmail}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Headquarters Card */}
            <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-slate-200">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase block mb-1">
                {t.contact.locationLabel}
              </span>
              <div className="flex items-center gap-3 mt-2 text-[#0F172A] font-medium text-sm">
                <MapPin size={18} className="text-[#192C56] shrink-0" />
                <span>{t.contact.locationValue}</span>
              </div>
            </div>

            {/* Official Channels List */}
            <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-slate-200">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase block mb-3">
                {t.contact.officialChannelsLabel}
              </span>
              <ChannelsList />
            </div>
          </div>

          {/* Right Column: Interactive Inquiry Form */}
          <div className="lg:col-span-7 bg-[#FAF9F6] p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-[#0F172A] mb-2">
              {t.contact.inquiryFormTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              {t.contact.formNotice}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                  {t.contact.formName} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:border-[#192C56] focus:ring-1 focus:ring-[#192C56] transition-all"
                  placeholder="e.g. Studio Partner / Publisher / Individual"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                  {t.contact.formEmail} *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:border-[#192C56] focus:ring-1 focus:ring-[#192C56] transition-all"
                  placeholder="name@organization.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                  {t.contact.formSubject} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:border-[#192C56] focus:ring-1 focus:ring-[#192C56] transition-all"
                  placeholder="Project Collaboration, Publishing, or Investment Inquiry"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                  {t.contact.formMessage} *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:border-[#192C56] focus:ring-1 focus:ring-[#192C56] transition-all"
                  placeholder="Provide context about your timeline, ideas, or discussion topic..."
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-4 text-sm font-bold text-white bg-[#192C56] hover:bg-[#233C70] disabled:opacity-60 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{sending ? "…" : t.contact.formSubmit}</span>
                <Send size={16} />
              </button>
              {sent && (
                <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
                  Pesan terkirim — kami akan merespons dalam 1–2 hari kerja.
                </p>
              )}
              {sendError && (
                <p className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl">
                  {sendError} — membuka aplikasi email sebagai cadangan…
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
