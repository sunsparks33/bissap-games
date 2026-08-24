'use client';

import Link from 'next/link';
import { Trophy, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function HeaderNav() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#050508]/90 border-b border-white/10 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="Bissap Games Official Logo"
            className="w-11 h-11 rounded-xl object-contain bg-[#FAF8F5] p-1 border border-white/20 shadow-lg shadow-[#FF1E56]/20 group-hover:scale-105 transition-transform"
          />
          <div>
            <span className="font-extrabold text-xl tracking-tight text-gradient-bissap block leading-none">
              BISSAP GAMES
            </span>
            <span className="text-[10px] tracking-widest uppercase text-gray-400 font-bold block mt-0.5">
              {t('navBrandSubtitle')}
            </span>
          </div>
        </Link>

        {/* Navigation Links & Language Switcher */}
        <div className="flex items-center gap-3 sm:gap-4">
          <LanguageSwitcher />

          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 hover:bg-white/5 transition-colors text-gray-200 hover:text-white"
            >
              <Trophy className="w-4 h-4 text-[#F59E0B]" />
              <span>{t('navLeaderboard')}</span>
            </Link>
            <Link
              href="/manager"
              className="btn-bissap text-xs sm:text-sm px-3.5 py-2 min-h-[38px]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t('navManagerPanel')}</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
