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
async function applyAppBackground(){
  try{
    const rows=await rpc('get_public_app_visual_settings',{}),r=Array.isArray(rows)?rows[0]:rows,img=safeBgImage(r?.body_image_data);
    // トップ画像（元のもぐマップのホーム上部と同じ）
    const hero=safeBgImage(r?.hero_image_data),w=document.getElementById('welcome');
    if(hero&&w&&!w.dataset.fixed){w.style.backgroundImage=`linear-gradient(135deg,rgba(52,177,183,.58),rgba(114,184,228,.54),rgba(239,154,170,.58)),url("${hero}")`;w.style.backgroundSize=`cover,${Number(r.hero_size)||100}% auto`;w.style.backgroundPosition=`center,${Number(r.hero_x??50)}% ${Number(r.hero_y??50)}%`;w.style.backgroundRepeat='no-repeat,no-repeat'}
    if(!img)return;
    // 画面に固定した背景レイヤー（スクロールしても画面いっぱい・iPhoneでもOK）
    let bg=document.getElementById('appBg');
    if(!bg){bg=document.createElement('div');bg.id='appBg';bg.setAttribute('aria-hidden','true');document.body.prepend(bg)}
    const size=Number(r.body_size)||100;
    bg.style.cssText=`position:fixed;inset:0;z-index:-1;pointer-events:none;background-image:linear-gradient(180deg,rgba(248,253,255,.82),rgba(238,249,246,.88)),url("${img}");background-size:cover,${size>100?size+'% auto':'cover'};background-position:center top,${Number(r.body_x??50)}% ${Number(r.body_y??0)}%;background-repeat:no-repeat,no-repeat`;
  }catch(e){console.warn('背景を読み込めませんでした',e)}
}
document.addEventListener('DOMContentLoaded',applyAppBackground);
async function loadPublicShops(){
  const rows=await api('/rest/v1/shop_public?select=*&is_published=eq.true&order=name.asc');
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
