// もぐマップ シンプル版：共通処理（元のもぐマップと同じデータベースを使います）
const API='https://lgidhjxowpueglduphzp.supabase.co';
const KEY='sb_publishable_beqwleruXXNe93qNA6UNzg_K9fSd5ft';
const PKEY='moga_rally_participant_v1'; // 元ページと同じ保存場所 → 参加情報・スタンプを共有

const $=id=>document.getElementById(id);
function esc(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function escBr(v){return esc(v).replace(/\n/g,'<br>')}
async function api(path,opt={}){
  const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),15000);
  try{
    const r=await fetch(API+path,{...opt,signal:ctl.signal,headers:{apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json',...(opt.headers||{})}});
    const text=await r.text();if(!r.ok)throw new Error(text||r.statusText);return text?JSON.parse(text):null;
  }finally{clearTimeout(t)}
}
const rpc=(name,body)=>api('/rest/v1/rpc/'+name,{method:'POST',body:JSON.stringify(body||{})});
function participant(){try{return JSON.parse(localStorage.getItem(PKEY)||'null')}catch{return null}}
function saveParticipant(v){try{localStorage.setItem(PKEY,JSON.stringify(v))}catch{}}
function auth(p){return{p_participant_id:p.id,p_participant_token:p.token}}
let toastTimer;
function toast(t){const el=$('toast');el.textContent=t;el.classList.add('on');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('on'),2600)}
async function copyText(text){
  if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);return}
  const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();
}
function errText(e){return String(e?.message||e||'').replace(/^Error:\s*/,'')}
// お店へのメール通知（Google Apps Script のURL。空なら通知機能はオフ）
const NOTIFY_URL='';
async function notifyCall(body){
  if(!NOTIFY_URL)throw new Error('通知の準備がまだです');
  const r=await fetch(NOTIFY_URL,{method:'POST',body:JSON.stringify(body)}); // text/plain で送る（Apps Script用）
  return r.json();
}
function notifyShop(shopId,kind){if(NOTIFY_URL&&shopId)notifyCall({action:'notify',shopId,kind:kind||'message'}).catch(e=>console.warn('通知できませんでした',e))}
// 元のもぐマップと同じ背景（主催者が「アプリデザイン管理」で登録した背景画像）
function safeBgImage(v){v=String(v||'');return /^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(v)||/^https:\/\/[^"'()\s]+$/.test(v)?v:''}
// 背景画像：今の背景はアプリと同じ場所（img/bg.jpg）に置いてあるので、毎回データベースから読まない（通信量の節約）
// 主催者が背景を変えたときだけ、新しい画像を1回だけ読んで、このスマホに保存する
const BG_STATIC_V=1789084575,BG_STATIC_URL=new URL('img/bg.jpg?v=1789084575',document.currentScript?.src||location.href).href;
async function applyAppBackground(){
  try{
    const m=await rpc('mogu_visual_meta',{});if(!m||!m.has_body)return;
    let img='';
    if(Number(m.v)===BG_STATIC_V)img=BG_STATIC_URL;
    else{
      try{const c=JSON.parse(localStorage.getItem('mogu_bg_cache')||'null');if(c&&c.v===m.v)img=c.img}catch{}
      if(!img){img=safeBgImage(await rpc('mogu_visual_body',{}));if(img){try{localStorage.setItem('mogu_bg_cache',JSON.stringify({v:m.v,img}))}catch{}}}
    }
    if(!img)return;
    let bg=document.getElementById('appBg');
    if(!bg){bg=document.createElement('div');bg.id='appBg';bg.setAttribute('aria-hidden','true');document.body.prepend(bg)}
    const size=Number(m.body_size)||100;
    bg.style.cssText=`position:fixed;inset:0;z-index:-1;pointer-events:none;background-image:linear-gradient(180deg,rgba(248,253,255,.82),rgba(238,249,246,.88)),url("${img}");background-size:cover,${size>100?size+'% auto':'cover'};background-position:center top,${Number(m.body_x??50)}% ${Number(m.body_y??0)}%;background-repeat:no-repeat,no-repeat`;
  }catch(e){console.warn('背景を読み込めませんでした',e)}
}
document.addEventListener('DOMContentLoaded',applyAppBackground);
async function loadPublicShops(){
    // 写真（image_url）はこのアプリでは使わないので読まない（通信量の節約）
  const cols='id,source_id,name,address,category,description,latitude,longitude,phone,community_url,point_purchase_url,stamp_rally_enabled,stamp_rally_note,spot_job_enabled,spot_job_title,spot_job_description,spot_job_hourly_wage,spot_job_schedule,spot_job_payment_method,spot_job_contact,is_published,updated_at,website_url,instagram_url,facebook_url,x_url,line_url,subcategory,main_category,rally_number,volunteer_enabled,volunteer_title,volunteer_description,volunteer_schedule,volunteer_contact,uw_url,youtube_url,map_location_status,google_listing_url,google_listing_verified,has_online_menu';
  const rows=await api(`/rest/v1/shop_public?select=${cols}&is_published=eq.true&order=name.asc`);
  return Array.isArray(rows)?rows:[];
}

/* ===== 自動でスライド＋指でもスライドできる帯 ===== */
function autoSlide(track,dots,ms=4500){
  if(!track||track.dataset.slide)return;track.dataset.slide='1';
  let i=0,hold=0,timer=0;const n=()=>track.children.length;
  const go=k=>{if(!n())return;i=(k+n())%n();track.scrollTo({left:track.children[i].offsetLeft-track.offsetLeft,behavior:'smooth'})};
  const mark=()=>{if(!dots)return;dots.querySelectorAll('i').forEach((d,k)=>d.classList.toggle('on',k===i))};
  if(dots){dots.innerHTML=Array.from({length:n()},()=>'<i></i>').join('');dots.onclick=e=>{const k=[...dots.children].indexOf(e.target);if(k>=0){hold=Date.now();go(k)}};mark()}
  let st=0;track.addEventListener('scroll',()=>{clearTimeout(st);st=setTimeout(()=>{const w=track.children[0]?.offsetWidth||1;i=Math.round(track.scrollLeft/(w+parseFloat(getComputedStyle(track).columnGap||0)||w));mark()},80)},{passive:true});
  ['touchstart','pointerdown','wheel'].forEach(ev=>track.addEventListener(ev,()=>{hold=Date.now()},{passive:true}));
  timer=setInterval(()=>{if(n()<2||document.hidden||Date.now()-hold<8000)return;go(i+1)},ms);
  return {go,stop:()=>clearInterval(timer)};
}
/* 開催中・もうすぐのイベントを判定 */
function festiveInfo(t){
  const p=t?.period||{},now=Date.now(),jd=v=>new Date(v).toLocaleDateString('ja-JP',{timeZone:'Asia/Tokyo',month:'numeric',day:'numeric'});
  const ev=(t?.events||[]).find(e=>{const d=new Date(e.event_date+'T23:59:59+09:00').getTime();return d>=now&&d-now<8*864e5});
  if(p.running)return {on:true,kind:'rally',text:`🎉 スタンプラリー開催中！${p.ends_at?`（${jd(p.ends_at)}まで）`:''}`};
  if(ev){const today=new Date().toLocaleDateString('ja-JP',{timeZone:'Asia/Tokyo'})===new Date(ev.event_date+'T12:00:00+09:00').toLocaleDateString('ja-JP',{timeZone:'Asia/Tokyo'});
    return {on:true,kind:'event',text:today?`🎪 今日は「${ev.title}」！`:`🎪 もうすぐ「${ev.title}」（${jd(ev.event_date+'T12:00:00+09:00')}）`}}
  return {on:false};
}
function startFestive(){
  document.body.classList.add('festive');
  if(document.querySelector('.confetti'))return;
  const c=document.createElement('div');c.className='confetti';const cols=['#ff7aa2','#ffd84d','#6ab8ff','#7ed6a5','#ffb347','#c39bff'];
  c.innerHTML=Array.from({length:18},(_,k)=>`<i style="left:${Math.random()*100}%;background:${cols[k%cols.length]};animation-duration:${7+Math.random()*7}s;animation-delay:${-Math.random()*12}s;transform:rotate(${Math.random()*360}deg)"></i>`).join('');
  document.body.appendChild(c);
}
