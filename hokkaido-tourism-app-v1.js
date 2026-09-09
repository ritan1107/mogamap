(() => {
  const DEFAULT_VISUALS={heroImage:'',bodyImage:'',heroPosition:'center',bodyPosition:'center top'};
  function visualSettings(){try{return {...DEFAULT_VISUALS,...JSON.parse(localStorage.getItem('moguVisualSettings')||'{}')}}catch(e){return {...DEFAULT_VISUALS}}}
  function applyVisuals(){
    const s=visualSettings(),hero=document.querySelector('.sapporoSkyline');
    document.body.classList.toggle('hasCustomBodyBg',!!s.bodyImage);
    if(s.bodyImage){document.body.style.setProperty('--mogu-body-bg',`url("${s.bodyImage.replace(/"/g,'%22')}")`);document.body.style.setProperty('--mogu-body-pos',s.bodyPosition||'center top')}else{document.body.style.removeProperty('--mogu-body-bg');document.body.style.removeProperty('--mogu-body-pos')}
    if(hero){hero.classList.toggle('hasCustomHero',!!s.heroImage);hero.style.setProperty('--mogu-hero-bg',s.heroImage?`url("${s.heroImage.replace(/"/g,'%22')}")`:'none');hero.style.setProperty('--mogu-hero-pos',s.heroPosition||'center')}
  }
  function activeView(){return document.querySelector('.view.on')?.id||'mapView'}
  function syncActive(){
    const v=activeView();
    document.querySelectorAll('.tourismQuickNav button').forEach(b=>{
      let on=b.dataset.view===v;
      if(b.dataset.rank==='customer')on=v==='stampView'&&document.getElementById('customerRankTab')?.classList.contains('on');
      b.classList.toggle('selected',!!on);b.setAttribute('aria-current',on?'page':'false');
    });
    document.querySelectorAll('nav.bottom .tab').forEach(b=>b.classList.toggle('current',b.dataset.view===v));
  }
  function go(view){if(typeof window.switchView==='function')window.switchView(view);else document.querySelectorAll('.view').forEach(x=>x.classList.toggle('on',x.id===view));requestAnimationFrame(syncActive)}
  window.moguGo=go;

  function addHero(){
    if(document.getElementById('moguTourismHero'))return;
    const main=document.querySelector('main');if(!main)return;
    const hero=document.createElement('section');hero.id='moguTourismHero';hero.className='moguTourismHero';
    hero.innerHTML=`<div class="sapporoSkyline" aria-hidden="true"><span class="landmark clock">🕰️<b>時計台</b></span><span class="landmark tower">🗼<b>テレビ塔</b></span><span class="landmark brick">🏛️<b>赤れんが</b></span><span class="landmark shop">🏪<b>札幌のお店</b></span></div><div class="heroCopy"><small>めぐる・たべる・つながる</small><h1>もぐマップ <span>HOKKAIDO</span></h1><p>食べて・つながって・応援しよう！</p></div><div class="heroMascot" aria-hidden="true">🐶<span>さあ、北海道を巡ろう！</span></div><div class="tourismQuickNav"><button data-view="mapView" type="button" onclick="moguGo('mapView')"><b>🗺️</b><span>地図</span></button><button data-view="mapView" type="button" onclick="moguGo('mapView');setTimeout(()=>document.getElementById('search')?.focus(),50)"><b>🏪</b><span>お店</span></button><button data-view="stampView" type="button" onclick="moguGo('stampView')"><b>🎫</b><span>スタンプ</span></button><button data-view="stampView" data-rank="customer" type="button" onclick="moguGo('stampView');setTimeout(()=>{showRankingPage?.('customer');syncActive()},80)"><b>🏆</b><span>ランキング</span></button><button data-view="myPageView" type="button" onclick="openMyPage?.();setTimeout(syncActive,80)"><b>👤</b><span>マイページ</span></button><button data-view="moreView" type="button" onclick="moguGo('moreView')"><b>⚙️</b><span>その他</span></button></div>`;
    main.parentNode.insertBefore(hero,main);applyVisuals();
  }
  function addFoodStrip(){if(document.getElementById('moguFoodStrip'))return;const mapView=document.getElementById('mapView');if(!mapView)return;const strip=document.createElement('div');strip.id='moguFoodStrip';strip.className='moguFoodStrip';strip.innerHTML=`<button onclick="setMoguSearch('ラーメン')">🍜<span>札幌ラーメン</span></button><button onclick="setMoguSearch('海鮮')">🦀<span>海鮮</span></button><button onclick="setMoguSearch('スイーツ')">🍦<span>スイーツ</span></button><button onclick="setMoguSearch('ジンギスカン')">🥩<span>ジンギスカン</span></button><button onclick="setMoguSearch('カフェ')">☕<span>カフェ巡り</span></button>`;const heading=mapView.querySelector('.heading');if(heading)heading.parentNode.insertBefore(strip,heading)}
  window.setMoguSearch=function(q){const input=document.getElementById('search');if(input){input.value=q;input.dispatchEvent(new Event('input',{bubbles:true}))}if(typeof window.renderAll==='function')renderAll();else if(typeof window.renderShops==='function')renderShops();go('mapView')};

  function fileToDataUrl(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)})}
  function addDesignEditor(){
    const more=document.querySelector('#moreView .panel');if(!more||document.getElementById('moguDesignEditor'))return;
    const box=document.createElement('details');box.id='moguDesignEditor';box.className='moguDesignEditor';box.innerHTML=`<summary>🎨 背景・トップ画像を編集</summary><div class="moguDesignEditorBody"><label><b>トップ画像</b><input id="moguHeroFile" type="file" accept="image/*"></label><div class="editorRow"><button id="moguHeroClear" type="button">トップ画像を元に戻す</button></div><label><b>アプリ全体の背景画像</b><input id="moguBodyFile" type="file" accept="image/*"></label><div class="editorRow"><button id="moguBodyClear" type="button">全体背景を元に戻す</button></div><small>画像を選ぶだけで差し替えできます。この端末のブラウザに保存されます。</small></div>`;more.appendChild(box);
    const save=async(key,file)=>{if(!file)return;const data=await fileToDataUrl(file);if(data.length>4_500_000){alert('画像が大きすぎます。4MB程度までの画像を使ってください。');return}const s=visualSettings();s[key]=data;localStorage.setItem('moguVisualSettings',JSON.stringify(s));applyVisuals()};
    box.querySelector('#moguHeroFile').addEventListener('change',e=>save('heroImage',e.target.files?.[0]));box.querySelector('#moguBodyFile').addEventListener('change',e=>save('bodyImage',e.target.files?.[0]));
    box.querySelector('#moguHeroClear').onclick=()=>{const s=visualSettings();s.heroImage='';localStorage.setItem('moguVisualSettings',JSON.stringify(s));applyVisuals()};box.querySelector('#moguBodyClear').onclick=()=>{const s=visualSettings();s.bodyImage='';localStorage.setItem('moguVisualSettings',JSON.stringify(s));applyVisuals()};
  }
  function boot(){addHero();addFoodStrip();addDesignEditor();applyVisuals();syncActive();const observer=new MutationObserver(()=>requestAnimationFrame(syncActive));document.querySelectorAll('.view').forEach(v=>observer.observe(v,{attributes:true,attributeFilter:['class']}));const rally=document.getElementById('rallyArea');if(rally)observer.observe(rally,{subtree:true,attributes:true,attributeFilter:['class']});document.addEventListener('click',()=>setTimeout(syncActive,60),true)}
  window.syncMoguActivePage=syncActive;window.applyMoguVisuals=applyVisuals;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();