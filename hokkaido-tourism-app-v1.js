(() => {
  const PAGE_META={mapView:['🗺️','地図・お店を探す'],stampView:['🎫','スタンプラリー'],myPageView:['👤','マイページ'],moreView:['⚙️','その他・設定']};
  function activeView(){return document.querySelector('.view.on')?.id||'mapView'}
  function currentLabel(){
    const v=activeView();
    if(v==='stampView'){
      const shop=document.getElementById('shopRankTab');
      const customer=document.getElementById('customerRankTab');
      if(shop?.classList.contains('on'))return ['🏪','加盟店ランキング'];
      if(customer?.classList.contains('on'))return ['🏆','お客様ランキング'];
    }
    return PAGE_META[v]||['📍','もぐマップ'];
  }
  function syncActive(){
    const v=activeView(),[icon,label]=currentLabel();
    const bar=document.getElementById('moguCurrentPage');
    if(bar)bar.innerHTML=`<span>いま見ているページ</span><strong>${icon} ${label}</strong>`;
    document.querySelectorAll('.tourismQuickNav button').forEach(b=>{
      const target=b.dataset.view;
      let on=target===v;
      if(b.dataset.rank==='customer')on=v==='stampView'&&document.getElementById('customerRankTab')?.classList.contains('on');
      if(b.dataset.rank==='shop')on=v==='stampView'&&document.getElementById('shopRankTab')?.classList.contains('on');
      b.classList.toggle('selected',!!on);
      b.setAttribute('aria-current',on?'page':'false');
    });
    document.querySelectorAll('nav.bottom .tab').forEach(b=>b.classList.toggle('current',b.dataset.view===v));
  }
  function go(view){
    if(typeof window.switchView==='function')window.switchView(view);else document.querySelectorAll('.view').forEach(x=>x.classList.toggle('on',x.id===view));
    requestAnimationFrame(syncActive);
  }
  window.moguGo=go;

  function addHero(){
    if(document.getElementById('moguTourismHero'))return;
    const main=document.querySelector('main');if(!main)return;
    const hero=document.createElement('section');
    hero.id='moguTourismHero';hero.className='moguTourismHero';
    hero.innerHTML=`
      <div class="sapporoSkyline" aria-hidden="true"><span class="landmark clock">🕰️<b>時計台</b></span><span class="landmark tower">🗼<b>テレビ塔</b></span><span class="landmark brick">🏛️<b>赤れんが</b></span><span class="landmark shop">🏪<b>札幌のお店</b></span></div>
      <div class="heroCopy"><small>めぐる・たべる・つながる</small><h1>もぐマップ <span>HOKKAIDO</span></h1><p>食べて・つながって・応援しよう！</p></div>
      <div class="heroMascot" aria-hidden="true">🐶<span>さあ、北海道を巡ろう！</span></div>
      <div class="tourismQuickNav">
        <button data-view="mapView" type="button" onclick="moguGo('mapView')"><b>🗺️</b><span>地図</span></button>
        <button data-view="mapView" type="button" onclick="moguGo('mapView');setTimeout(()=>document.getElementById('search')?.focus(),50)"><b>🏪</b><span>お店</span></button>
        <button data-view="stampView" type="button" onclick="moguGo('stampView')"><b>🎫</b><span>スタンプ</span></button>
        <button data-view="stampView" data-rank="customer" type="button" onclick="moguGo('stampView');setTimeout(()=>{showRankingPage?.('customer');syncActive()},80)"><b>🏆</b><span>ランキング</span></button>
        <button data-view="myPageView" type="button" onclick="openMyPage?.();setTimeout(syncActive,80)"><b>👤</b><span>マイページ</span></button>
        <button data-view="moreView" type="button" onclick="moguGo('moreView')"><b>⚙️</b><span>その他</span></button>
      </div>
      <div id="moguCurrentPage" class="moguCurrentPage"><span>いま見ているページ</span><strong>🗺️ 地図・お店を探す</strong></div>`;
    main.parentNode.insertBefore(hero,main);
  }

  function addFoodStrip(){
    if(document.getElementById('moguFoodStrip'))return;
    const mapView=document.getElementById('mapView');if(!mapView)return;
    const strip=document.createElement('div');strip.id='moguFoodStrip';strip.className='moguFoodStrip';
    strip.innerHTML=`<button onclick="setMoguSearch('ラーメン')">🍜<span>札幌ラーメン</span></button><button onclick="setMoguSearch('海鮮')">🦀<span>海鮮</span></button><button onclick="setMoguSearch('スイーツ')">🍦<span>スイーツ</span></button><button onclick="setMoguSearch('ジンギスカン')">🥩<span>ジンギスカン</span></button><button onclick="setMoguSearch('カフェ')">☕<span>カフェ巡り</span></button>`;
    const heading=mapView.querySelector('.heading');if(heading)heading.parentNode.insertBefore(strip,heading);
  }
  window.setMoguSearch=function(q){const input=document.getElementById('search');if(input){input.value=q;input.dispatchEvent(new Event('input',{bubbles:true}));}if(typeof window.renderAll==='function')renderAll();else if(typeof window.renderShops==='function')renderShops();go('mapView');};

  function boot(){
    addHero();addFoodStrip();syncActive();
    const observer=new MutationObserver(()=>requestAnimationFrame(syncActive));
    document.querySelectorAll('.view').forEach(v=>observer.observe(v,{attributes:true,attributeFilter:['class']}));
    const rally=document.getElementById('rallyArea');if(rally)observer.observe(rally,{subtree:true,attributes:true,attributeFilter:['class']});
    document.addEventListener('click',()=>setTimeout(syncActive,60),true);
  }
  window.syncMoguActivePage=syncActive;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();