import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#philosophy', label: t.nav.about },
    { href: '#works', label: t.nav.works },
    { href: '#capabilities', label: t.nav.capabilities },
    { href: '#milestones', label: t.nav.milestones },
    { href: '#team', label: t.nav.team },
    { href: '#contact', label: t.nav.contact }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF9F6]/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#"
            className="flex items-center gap-3 group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#192C56] focus-visible:ring-offset-2 rounded-xl"
            aria-label="Merantaw Home"
          >
            <img
              src="/assets/merantaw-mark.svg"
              alt="Merantaw Emblem"
              className="w-9 h-9 rounded-xl shadow-xs transition-transform duration-200 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-extrabold tracking-widest text-lg text-[#192C56] leading-tight">
                MERANTAW
              </span>
              <span className="text-[9px] font-semibold tracking-wider text-slate-500 uppercase">
                Game &amp; Interactive Studio
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold tracking-wide uppercase text-slate-600">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-[#192C56] py-1 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#192C56] transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right Action: Language Switcher + Inquire CTA */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageToggle />
            <a
              href="#contact"
              className="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold tracking-wide text-white bg-[#192C56] hover:bg-[#233C70] rounded-full transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer"
            >
              <span>{t.nav.inquireBtn}</span>
              <ArrowUpRight size={14} />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            <LanguageToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-[#192C56] rounded-lg focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#192C56] focus-visible:ring-offset-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF9F6] border-b border-slate-200 px-6 py-6 shadow-xl animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-4 text-sm font-semibold tracking-wide uppercase text-slate-700">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-slate-100 hover:text-[#192C56] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center gap-1.5 w-full py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#192C56] rounded-xl"
              >
                <span>{t.nav.inquireBtn}</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
