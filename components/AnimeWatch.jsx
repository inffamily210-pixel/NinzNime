'use client';
import Link from 'next/link';
function episodeNumber(item,index){return Number(item?.number||item?.episode||item?.episodeNumber||item?.ep||index+1)||index+1}
function episodeTitle(item,index){return item?.title||item?.name||item?.episodeTitle||'Episode '+(index+1)}
function serverName(item){return typeof item==='string'?item:item?.name||item?.server||item?.label||item?.id||'HD-1'}
function sourceFrom(value){
 if(!value)return null;
 if(typeof value==='string')return value;
 if(Array.isArray(value)){for(const x of value){const s=sourceFrom(x);if(s)return s;}return null;}
 if(typeof value==='object'){
  for(const key of ['url','file','src','link','streamUrl','stream_url'])if(typeof value[key]==='string'&&value[key])return value[key];
  for(const key of ['sources','data','result','stream','videos','playlist']){const s=sourceFrom(value[key]);if(s)return s;}
 }
 return null;
}
function embedFrom(value){
 if(!value||typeof value!=='object')return null;
 for(const key of ['embed','embedUrl','iframe','player','url_embed'])if(typeof value[key]==='string'&&value[key])return value[key];
 for(const key of ['data','result','stream']){const found=embedFrom(value[key]);if(found)return found;}
 return null;
}
function isVideo(url){return /\.(m3u8|mp4|webm)(\?|$)/i.test(url||'');}
export default function AnimeWatch({animeId,title,poster,synopsis,anime,episodes,activeEpisode,servers,activeServer,stream,fallbackPlayUrl}){
 const source=sourceFrom(stream);
 const embed=embedFrom(stream);
 const videoSource=source&&isVideo(source)?source:null;
 const iframeSource=embed||(!videoSource?(source||fallbackPlayUrl):null);
 const episodeItems=episodes.length?episodes:Array.from({length:Number(anime?.episodes)||0},(_,i)=>({number:i+1}));
 return <div className="watch-page">
  <Link href="/" className="watch-back">← Kembali ke beranda</Link>
  <section className="watch-detail">
   {poster?<img className="watch-poster" src={poster} alt={title}/>:<div className="watch-poster watch-poster-empty">NINZ<br/>NIME</div>}
   <div className="watch-info"><span className="eyebrow">INFORMASI ANIME</span><h1>{title}</h1><div className="watch-tags">{anime?.status&&<span>{anime.status}</span>}{anime?.type&&<span>{anime.type}</span>}{anime?.episodes&&<span>{anime.episodes} Episode</span>}{anime?.score&&<span>★ {anime.score}</span>}</div><p>{synopsis}</p></div>
  </section>
  <section className="watch-player-section" id="player"><div className="watch-section-heading"><div><span className="eyebrow">NOW PLAYING</span><h2>{title}</h2></div><span className="episode-chip">EPISODE {activeEpisode}</span></div>
   <div className="video-frame">{videoSource?<video key={videoSource} controls playsInline poster={poster||undefined} src={videoSource}>Browser kamu tidak mendukung video.</video>:iframeSource?<iframe key={iframeSource} src={iframeSource} title={title+' episode '+activeEpisode} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="no-referrer"/>:<div className="player-error"><b>Video belum tersedia</b><p>Server streaming belum memberikan sumber video untuk episode ini.</p></div>}</div>
   <div className="player-controls"><span>Episode {activeEpisode}</span><div className="server-picker"><label htmlFor="server-select">Server</label><select id="server-select" value={activeServer} onChange={e=>{const u=new URL(window.location.href);u.searchParams.set('server',e.target.value);window.location.href=u.toString()}}>{[...new Set(['HD-1',...servers.map(serverName)])].map(s=><option key={s} value={s}>{s}</option>)}</select></div></div>
  </section>
  <section className="episode-section"><div className="watch-section-heading"><div><span className="eyebrow">PILIH EPISODE</span><h2>Daftar Episode</h2></div><span className="episode-total">{episodes.length||episodeItems.length} episode</span></div>
   {episodeItems.length?<div className="episode-grid">{episodeItems.map((item,index)=>{const n=episodeNumber(item,index);return <Link scroll={false} key={item?.id||item?.slug||n} href={'/anime/'+encodeURIComponent(animeId)+'?ep='+n+'&server='+encodeURIComponent(activeServer)+'#player'} className={'episode-button '+(n===activeEpisode?'selected':'')}><span>EP</span><b>{n}</b>{item?.title&&<small>{episodeTitle(item,index)}</small>}</Link>})}</div>:<div className="episode-empty">Daftar episode belum tersedia dari API.</div>}
  </section>
 </div>
}
