(() => {
  function go(view){
    if(typeof window.switchView==='function') return window.switchView(view);
    document.querySelectorAll('.view').forEach(x=>x.classList.toggle('on',x.id===view));
  }
  window.moguGo=go;

  function addHero(){
    if(document.getElementById('moguTourismHero'))return;
    const main=document.querySelector('main');if(!main)return;
    const hero=document.createElement('section');
    hero.id='moguTourismHero';
    hero.className='moguTourismHero';
    hero.innerHTML=`
      <div class="sapporoSkyline" aria-hidden="true">
        <span class="landmark clock">🕰️<b>時計台</b></span>
        <span class="landmark tower">🗼<b>テレビ塔</b></span>
        <span class="landmark brick">🏛️<b>赤れんが</b></span>
        <span class="landmark shop">🏪<b>札幌のお店</b></span>
      </div>
      <div class="heroCopy">
        <small>めぐる・たべる・つながる</small>
        <h1>もぐマップ <span>HOKKAIDO</span></h1>
        <p>食べて・つながって・応援しよう！</p>
      </div>
      <div class="heroMascot" aria-hidden="true">🐶<span>さあ、北海道を巡ろう！</span></div>
      <div class="tourismQuickNav">
        <button type="button" onclick="moguGo('mapView')"><b>🗺️</b><span>地図から探す</span></button>
        <button type="button" onclick="document.getElementById('search')?.focus();moguGo('mapView')"><b>🏪</b><span>お店を探す</span></button>
        <button type="button" class="hot" onclick="moguGo('stampView')"><b>🎫</b><span>スタンプ</span></button>
        <button type="button" onclick="moguGo('stampView');setTimeout(()=>showRankingPage?.('customer'),50)"><b>🏆</b><span>ランキング</span></button>
        <button type="button" onclick="openMyPage?.()"><b>👤</b><span>マイページ</span></button>
        <button type="button" onclick="moguGo('moreView')"><b>•••</b><span>その他</span></button>
      </div>`;
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

  function boot(){addHero();addFoodStrip();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();