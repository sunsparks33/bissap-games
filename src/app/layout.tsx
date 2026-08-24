import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import HeaderNav from '@/components/HeaderNav';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'Bissap Games | Official Fitness Leaderboard & Event Platform',
  description: 'Official registration, event tracking, and live team leaderboards for Bissap Games relay races & strength challenges across Morocco.',
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
      <body className="antialiased text-gray-100 min-h-screen flex flex-col selection:bg-[#FF1E56] selection:text-white bg-[#050508]">
        <LanguageProvider>
          {/* Navigation Bar */}
          <HeaderNav />

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-white/10 bg-[#050508] py-8 text-center text-xs text-gray-400 mt-12">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Bissap Games Logo"
                  className="w-7 h-7 rounded-lg object-contain bg-[#FAF8F5] p-0.5 border border-white/20"
                />
                <span className="font-bold text-gray-300">Bissap Games Official Platform</span>
                <span>— Morocco National Fitness Tour</span>
              </div>
              <div className="text-gray-500">
                Powered by Next.js & Prisma • Built for high-performance fitness events
              </div>
            </div>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
