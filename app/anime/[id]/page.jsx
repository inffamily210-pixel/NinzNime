import {getAnimeDetail,getEpisodes,getServers,getStream,getPlayUrl} from '@/lib/api';
import AnimeWatch from '@/components/AnimeWatch';

function unwrap(value,keys,depth=0){
 if(value==null||depth>4)return null;
 if(Array.isArray(value))return value;
 if(typeof value!=='object')return value;
 for(const key of keys){if(value[key]!=null){const result=unwrap(value[key],keys,depth+1);if(result!=null)return result;}}
 return value;
}
function listOf(value,keys){
 if(Array.isArray(value))return value;
 if(!value||typeof value!=='object')return [];
 for(const key of keys){if(value[key]!=null){const result=listOf(value[key],keys);if(result.length)return result;}}
 for(const v of Object.values(value)){if(v&&typeof v==='object'){const result=listOf(v,keys);if(result.length)return result;}}
 return [];
}
export default async function Page({params,searchParams}){
 const {id}=await params;
 const query=await searchParams;
 const ep=Number(query?.ep)||1;
 const server=typeof query?.server==='string'?query.server:'HD-1';
 const [detail,episodeResponse,serverResponse]=await Promise.all([getAnimeDetail(id),getEpisodes(id),getServers(id,ep)]);
 const anime=unwrap(detail,['data','anime','result'])||{};
 const episodes=listOf(episodeResponse,['episodes','data','results','items','list']);
 const servers=listOf(serverResponse,['servers','data','results','items','list']);
 const stream=await getStream(id,ep,server,'sub');
 const title=anime?.title?.english||anime?.title?.romaji||anime?.title?.userPreferred||(typeof anime?.title==='string'?anime.title:null)||anime?.name||anime?.japaneseTitle||'Detail Anime';
 const poster=anime?.poster||anime?.image||anime?.cover||anime?.coverImage?.large||anime?.images?.jpg?.large_image_url||anime?.thumbnail||'';
 const synopsis=anime?.description||anime?.synopsis||anime?.overview||'Sinopsis belum tersedia.';
 const playUrl=getPlayUrl(id,ep,server,'sub');
 return <AnimeWatch animeId={id} title={title} poster={poster} synopsis={synopsis} anime={anime} episodes={episodes} activeEpisode={ep} servers={servers} activeServer={server} stream={stream} fallbackPlayUrl={playUrl}/>;
}
