import {getGenres} from '@/lib/api';
import Link from 'next/link';

const fallbackGenres=['Action','Adventure','Comedy','Drama','Fantasy','Horror','Mystery','Romance','Sci-Fi','Slice of Life','Sports','Supernatural','Thriller','Music','School','Psychological','Mecha','Isekai','Martial Arts','Historical','Demons','Military','Parody','Shounen','Shoujo','Seinen','Josei'];

function extractGenres(value,depth=0){
 if(depth>5||value==null)return [];
 if(Array.isArray(value))return value.flatMap(item=>typeof item==='string'?[item]:extractGenres(item,depth+1));
 if(typeof value!=='object')return [];
 for(const key of ['genres','genreList','results','items','data','list']){
  if(value[key]!=null){const found=extractGenres(value[key],depth+1);if(found.length)return found;}
 }
 if(value.name||value.genre||value.title)return [value];
 return [];
}
function normalizeGenre(item){
 const name=typeof item==='string'?item:item?.name||item?.genre||item?.title||item?.slug;
 if(!name||typeof name!=='string')return null;
 return {name:name.trim(),slug:typeof item==='object'?(item.slug||item.name||item.genre||name):name};
}
export default async function GenresPage(){
 const response=await getGenres();
 const raw=extractGenres(response);
 const unique=new Map();
 raw.map(normalizeGenre).filter(Boolean).forEach(g=>unique.set(g.name.toLowerCase(),g));
 const genres=unique.size?[...unique.values()]:fallbackGenres.map(name=>({name,slug:name}));
 return <div className="genre-page">
  <div className="genre-hero"><span className="eyebrow">TEMUKAN CERITAMU</span><h1>Jelajahi <em>Genre</em></h1><p>Pilih genre favorit dan temukan anime yang cocok dengan suasana hatimu.</p><span className="genre-count">{genres.length} GENRE TERSEDIA</span></div>
  {!unique.size&&<p className="genre-fallback-note">Menampilkan daftar genre populer sementara. Data genre dari server belum tersedia.</p>}
  <div className="genre-grid">{genres.map((g,i)=><Link key={g.name} href={'/genre/'+encodeURIComponent(g.slug)} className="genre-tile"><span className="genre-number">{String(i+1).padStart(2,'0')}</span><span className="genre-name">{g.name}</span><span className="genre-arrow">↗</span></Link>)}</div>
 </div>
}
