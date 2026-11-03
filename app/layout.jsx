import './globals.css';
import SiteHeader from '@/components/SiteHeader';
export const metadata={title:'NinzNime — Anime Discovery',description:'Temukan anime terbaru, trending, dan populer di NinzNime.'};
export default function RootLayout({children}){return <html lang="id"><body><SiteHeader/><main className="min-h-screen">{children}</main><footer className="p-6 text-center text-xs">NinzNime · Temukan cerita anime favoritmu.</footer></body></html>}
