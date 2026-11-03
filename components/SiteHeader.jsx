'use client';
import {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

const links=[['Beranda','/'],['Trending','/trending'],['Popular','/popular'],['Jadwal','/schedule'],['Genre','/genres'],['Top Anime','/top-airing']];
export default function SiteHeader(){
 const [open,setOpen]=useState(false),[search,setSearch]=useState('');
 const router=useRouter();
 function submit(e){e.preventDefault();const q=search.trim();if(q)router.push('/search?q='+encodeURIComponent(q));setOpen(false)}
 return <header className="site-header">
  <div className="header-inner">
   <button className="menu-toggle" aria-label="Buka menu" onClick={()=>setOpen(!open)}><span/><span/><span/></button>
   <Link href="/" className="brand" onClick={()=>setOpen(false)}><span className="brand-mark">N</span><span>Ninz<span className="brand-accent">Nime</span><small>ANIME DISCOVERY</small></span></Link>
   <nav className="desktop-nav">{links.map(([label,href])=><Link href={href} key={href}>{label}</Link>)}</nav>
   <form className="header-search" onSubmit={submit}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari anime..."/><button aria-label="Cari">⌕</button></form>
  </div>
  <div className={'mobile-menu '+(open?'is-open':'')} aria-hidden={!open}>
   {links.map(([label,href])=><Link href={href} key={href} onClick={()=>setOpen(false)}>{label}<span>›</span></Link>)}
   <form className="mobile-search" onSubmit={submit}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari judul anime..."/><button type="submit">Cari</button></form>
  </div>
  {open&&<button className="menu-backdrop" aria-label="Tutup menu" onClick={()=>setOpen(false)}/>}
 </header>
}
