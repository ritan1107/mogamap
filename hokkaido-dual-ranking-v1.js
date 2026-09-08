(() => {
  let rankMode='customer';
  const esc2=v=>typeof esc==='function'?esc(v):String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function ensureRankingTabs(){
    const a=document.getElementById('rallyArea');if(!a)return;
    let nav=document.getElementById('rankingPageTabs');
    if(!nav){
      nav=document.createElement('div');nav.id='rankingPageTabs';nav.className='rankingPageTabs';
      nav.innerHTML='<button id="customerRankTab" type="button">👤 お客様ランキング</button><button id="shopRankTab" type="button">🏪 加盟店ランキング</button>';
      a.prepend(nav);
      nav.querySelector('#customerRankTab').onclick=()=>showRankingPage('customer');
      nav.querySelector('#shopRankTab').onclick=()=>showRankingPage('shop');
    }
    let shop=document.getElementById('shopRankingPage');
    if(!shop){shop=document.createElement('div');shop.id='shopRankingPage';shop.className='rankingPanel shopRankingPage';a.appendChild(shop);}
    updateRankTabs();
  }

  function updateRankTabs(){
    const c=document.getElementById('customerRankTab'),s=document.getElementById('shopRankTab');
    c?.classList.toggle('on',rankMode==='customer');s?.classList.toggle('on',rankMode==='shop');
    const customer=document.getElementById('publicRankingBox'),shop=document.getElementById('shopRankingPage');
    if(customer)customer.style.display=rankMode==='customer'?'':'none';
    if(shop)shop.style.display=rankMode==='shop'?'':'none';
  }

  window.showRankingPage=async function(mode){rankMode=mode==='shop'?'shop':'customer';ensureRankingTabs();updateRankTabs();if(rankMode==='shop')await loadShopRanking();else if(typeof window.loadPublicRanking==='function')await window.loadPublicRanking();};

  async function loadShopRanking(){
    const box=document.getElementById('shopRankingPage');if(!box)return;
    box.innerHTML='<div class="rankingLoading">加盟店ランキングを読み込んでいます…</div>';
    try{
      const [vis,data]=await Promise.all([
        api('rpc/get_shop_rally_ranking_visibility',{method:'POST',body:'{}'}),
        api('rpc/get_public_shop_rally_ranking',{method:'POST',body:'{}'})
      ]);
      const visible=Array.isArray(vis)?vis[0]:vis;
      const rows=Array.isArray(data)?data:[];
      if(!visible){box.innerHTML='<div class="rankingEmpty"><h3>🏪 加盟店スタンプラリーランキング</h3><p>現在は主催者設定で非表示です。</p></div>';return;}
      if(!rows.length){box.innerHTML='<div class="rankingEmpty"><h3>🏪 加盟店スタンプラリーランキング</h3><p>まだスタンプ実績がありません。</p></div>';return;}
      box.innerHTML=`<div class="rankingHead"><div><span>人気の参加加盟店</span><h3>🏪 加盟店ランキング TOP20</h3></div><small>獲得スタンプ人数順</small></div><div class="rankingList">${rows.map(r=>{const medal=r.rank_no===1?'🥇':r.rank_no===2?'🥈':r.rank_no===3?'🥉':'🏅';return `<article class="rankCard ${r.rank_no<=3?'rankTop':''}"><div class="rankNo">${medal}<strong>${r.rank_no}</strong></div><div class="rankMain"><div class="rankName">${esc2(r.shop_name||'加盟店')}</div><div class="rankCount">🎫 ${r.stamp_count||0} 人</div>${r.uw_url?`<a class="shopRankUw" target="_blank" rel="noopener" href="${esc2(r.uw_url)}">UW店舗ページを見る →</a>`:''}</div></article>`}).join('')}</div><p class="rankingFoot">加盟店ランキングの表示・非表示は主催者が選べます。</p>`;
    }catch(e){box.innerHTML='<div class="rankingEmpty"><h3>🏪 加盟店ランキング</h3><p>ランキングを読み込めませんでした。</p></div>';}
  }
  window.loadShopRanking=loadShopRanking;

  function addOrganizerRankingControl(){
    const panel=document.querySelector('#moreView .panel');if(!panel||document.getElementById('shopRankingAdminBox'))return;
    const box=document.createElement('div');box.id='shopRankingAdminBox';box.className='shopRankingAdminBox';
    box.innerHTML='<details><summary>🏪 加盟店ランキング公開設定</summary><div class="shopRankingAdminBody"><p>加盟店ランキングをお客様に見せる／隠すを主催者が選べます。</p><div class="actions"><button class="btn small" type="button" onclick="setShopRankingPublic(true)">表示する</button><button class="btn ghost small" type="button" onclick="setShopRankingPublic(false)">非表示にする</button></div><p id="shopRankingAdminMsg" class="muted"></p></div></details>';
    panel.appendChild(box);
  }

  window.setShopRankingPublic=async function(show){
    const pin=prompt('主催者PINを入力してください');if(pin===null)return;
    const msg=document.getElementById('shopRankingAdminMsg');if(msg)msg.textContent='確認中…';
    try{
      await api('rpc/set_shop_rally_ranking_visibility_by_pin',{method:'POST',body:JSON.stringify({p_pin:pin,p_show:!!show})});
      if(msg)msg.textContent=show?'✅ 加盟店ランキングを表示しました。':'✅ 加盟店ランキングを非表示にしました。';
      if(rankMode==='shop')loadShopRanking();
    }catch(e){if(msg)msg.textContent='主催者PINを確認してください。';}
  };

  function sync(){ensureRankingTabs();addOrganizerRankingControl();updateRankTabs();}
  const observer=new MutationObserver(sync);
  function boot(){sync();observer.observe(document.body,{childList:true,subtree:true});setTimeout(sync,300);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();