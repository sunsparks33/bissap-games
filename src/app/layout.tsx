import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { Trophy, ShieldCheck, Flame, Calendar, Users } from 'lucide-react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'Bissap Games | Fitness Leaderboard & Event Platform',
  description: 'Official registration, event tracking, and live team leaderboards for Bissap Games relay races & strength challenges.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased text-gray-100 min-h-screen flex flex-col selection:bg-[#E6093C] selection:text-white">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-[#050507]/90 border-b border-white/10 px-4 lg:px-8 py-3.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E6093C] to-[#9E002B] p-0.5 shadow-lg shadow-[#E6093C]/30 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#050507] rounded-[10px] flex items-center justify-center">
                  <Flame className="w-6 h-6 text-[#E6093C]" />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-gradient-bissap block leading-none">
                  BISSAP GAMES
                </span>
                <span className="text-[10px] tracking-widest uppercase text-gray-400 font-semibold block mt-0.5">
                  Casablanca Series
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/"
                className="px-3.5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-white/5 transition-colors text-gray-200 hover:text-white"
              >
                <Trophy className="w-4 h-4 text-[#FFB800]" />
                <span>Leaderboard</span>
              </Link>
              <Link
                href="/manager"
                className="btn-bissap text-xs sm:text-sm px-4 py-2 min-h-[40px]"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Manager Panel</span>
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-[#050507] py-8 text-center text-xs text-gray-500 mt-12">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#E6093C]" />
              <span className="font-semibold text-gray-400">Bissap Games Platform</span>
              <span>— Ain Diab Relays & Strength Challenges</span>
            </div>
            <div>
              Powered by Next.js & Prisma • Built for high-performance fitness events
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
