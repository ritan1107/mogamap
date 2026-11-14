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
    if(hero&&w){w.style.backgroundImage=`linear-gradient(135deg,rgba(52,177,183,.58),rgba(114,184,228,.54),rgba(239,154,170,.58)),url("${hero}")`;w.style.backgroundSize=`cover,${Number(r.hero_size)||100}% auto`;w.style.backgroundPosition=`center,${Number(r.hero_x??50)}% ${Number(r.hero_y??50)}%`;w.style.backgroundRepeat='no-repeat,no-repeat'}
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
