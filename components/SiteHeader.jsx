'use client';
import {useState} from 'react';
import Link from 'next/link';
import {usePathname,useRouter} from 'next/navigation';

const links=[
 ['Beranda','/','⌂'],['Trending','/trending','↗'],['Popular','/popular','★'],
 ['Jadwal','/schedule','▦'],['Genre','/genres','◇'],['Top Anime','/top-airing','♛']
];
export default function SiteHeader(){
 const [open,setOpen]=useState(false);
 const [searchOpen,setSearchOpen]=useState(false);
 const [search,setSearch]=useState('');
 const router=useRouter();
 const pathname=usePathname();
 function submit(e){
  e.preventDefault();
  const q=search.trim();
  if(!q)return;
  router.push('/search?q='+encodeURIComponent(q));
  setOpen(false);setSearchOpen(false);
 }
 function closePanels(){setOpen(false);setSearchOpen(false)}
 return <header className="site-header">
  <div className="header-inner">
   <button type="button" className={'menu-toggle '+(open?'is-active':'')} aria-label={open?'Tutup menu':'Buka menu'} aria-expanded={open} onClick={()=>{setOpen(v=>!v);setSearchOpen(false)}}>
    <span/><span/><span/>
   </button>
   <Link href="/" className="brand" onClick={closePanels}>
    <span className="brand-mark">N</span><span>Ninz<span className="brand-accent">Nime</span><small>ANIME DISCOVERY</small></span>
   </Link>
   <nav className="desktop-nav" aria-label="Navigasi utama">
    {links.map(([label,href])=><Link href={href} key={href} className={pathname===href?'active':''}>{label}</Link>)}
   </nav>
   <form className="header-search desktop-search" onSubmit={submit}>
    <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari anime..." aria-label="Cari anime"/>
    <button type="submit" aria-label="Cari">⌕</button>
   </form>
   <button type="button" className="mobile-search-toggle" aria-label={searchOpen?'Tutup pencarian':'Buka pencarian'} aria-expanded={searchOpen} onClick={()=>{setSearchOpen(v=>!v);setOpen(false)}}>⌕</button>
  </div>
  {searchOpen&&<form className="mobile-search-panel" onSubmit={submit}>
   <input autoFocus value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari judul anime..." aria-label="Cari judul anime"/>
   <button type="submit">Cari Anime</button>
  </form>}
  {open&&<div className="mobile-menu">
   <div className="mobile-menu-heading"><span>JELAJAHI NINZNIME</span><button type="button" onClick={()=>setOpen(false)} aria-label="Tutup menu">✕</button></div>
   <nav className="mobile-link-grid" aria-label="Navigasi mobile">
    {links.map(([label,href,icon])=><Link href={href} key={href} className={pathname===href?'active':''} onClick={closePanels}><span className="mobile-link-icon">{icon}</span><span>{label}</span><b>›</b></Link>)}
   </nav>
   <p className="mobile-menu-note">Temukan anime favoritmu hari ini.</p>
  </div>}
  {(open||searchOpen)&&<button type="button" className="menu-backdrop" aria-label="Tutup panel" onClick={closePanels}/>}
 </header>
}
