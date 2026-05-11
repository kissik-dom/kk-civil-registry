import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kissi Kingdom Civil Registry",
  description: "Sovereign citizen enrollment, identification, and document issuance platform for the Kingdom of the Kissi people.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="fixed top-0 left-0 right-0 z-50 bg-royal-dark/95 backdrop-blur border-b border-royal-gold/20">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <img src="/images/royal-seal.png" alt="Royal Seal" className="w-8 h-8 opacity-90" />
              <span className="font-display text-sm tracking-widest text-royal-gold/90">KK CIVIL REGISTRY</span>
            </a>
            <div className="flex items-center gap-4">
              <a href="/register" className="text-xs text-royal-cream/60 hover:text-royal-gold transition-colors">Register</a>
              <a href="/citizens" className="text-xs text-royal-cream/60 hover:text-royal-gold transition-colors">Citizens</a>
              <a href="/documents" className="text-xs text-royal-cream/60 hover:text-royal-gold transition-colors">Documents</a>
            </div>
          </div>
        </nav>
        <main className="pt-14 min-h-screen">{children}</main>
        <footer className="border-t border-royal-gold/10 py-6 text-center">
          <p className="text-[10px] text-royal-cream/30">Registered by authority of the Royal House of Kamanda</p>
          <p className="text-[10px] text-royal-cream/20 mt-1">Kissi Kingdom Civil Registry — Sovereign Document System</p>
        </footer>
      </body>
    </html>
  );
}
