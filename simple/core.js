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
async function loadPublicShops(){
  const rows=await api('/rest/v1/shop_public?select=*&is_published=eq.true&order=name.asc');
  return Array.isArray(rows)?rows:[];
}
