import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import Image from 'next/image';
import { Trophy, ShieldCheck } from 'lucide-react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'Bissap Games | Official Fitness Leaderboard & Event Platform',
  description: 'Official registration, event tracking, and live team leaderboards for Bissap Games relay races & strength challenges.',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased text-gray-100 min-h-screen flex flex-col selection:bg-[#FF1E56] selection:text-white">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#050508]/85 border-b border-white/10 px-4 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Brand Logo & Name */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 rounded-xl bg-white/5 border border-white/15 p-1 group-hover:scale-105 transition-transform overflow-hidden shadow-lg shadow-[#FF1E56]/20">
                <Image
                  src="/logo.png"
                  alt="Bissap Games Official Logo"
                  fill
                  className="object-contain p-0.5"
                  priority
                />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-gradient-bissap block leading-none">
                  BISSAP GAMES
                </span>
                <span className="text-[10px] tracking-widest uppercase text-gray-400 font-bold block mt-0.5">
                  Casablanca Series
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/"
                className="px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-white/5 transition-colors text-gray-200 hover:text-white"
              >
                <Trophy className="w-4 h-4 text-[#F59E0B]" />
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
        <footer className="border-t border-white/10 bg-[#050508] py-8 text-center text-xs text-gray-400 mt-12">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative w-7 h-7">
                <Image
                  src="/logo.png"
                  alt="Bissap Games Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-gray-300">Bissap Games Official Platform</span>
              <span>— Ain Diab Relays & Strength Arena</span>
            </div>
            <div className="text-gray-500">
              Powered by Next.js & Prisma • Built for high-performance fitness events
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
