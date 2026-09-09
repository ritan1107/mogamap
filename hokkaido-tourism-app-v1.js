(() => {
  let CLOUD_VISUALS={heroImage:'',bodyImage:''};
  function applyVisuals(){
    const s=CLOUD_VISUALS,hero=document.querySelector('.sapporoSkyline');
    document.body.classList.toggle('hasCustomBodyBg',!!s.bodyImage);
    if(s.bodyImage)document.body.style.setProperty('--mogu-body-bg',`url("${s.bodyImage.replace(/"/g,'%22')}")`);else document.body.style.removeProperty('--mogu-body-bg');
    if(hero){hero.classList.toggle('hasCustomHero',!!s.heroImage);hero.style.setProperty('--mogu-hero-bg',s.heroImage?`url("${s.heroImage.replace(/"/g,'%22')}")`:'none')}
  }
  async function loadPublicVisuals(){
    try{
      const data=await api('rpc/get_public_app_visual_settings',{method:'POST',body:'{}'});
      const r=Array.isArray(data)?data[0]:data;
      CLOUD_VISUALS={heroImage:r?.hero_image_data||'',bodyImage:r?.body_image_data||''};
      applyVisuals();
    }catch(e){console.warn('visual settings unavailable',e)}
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

  async function compressImage(file,maxW=1600,maxH=1200,quality=.82){
    const bmp=await createImageBitmap(file),scale=Math.min(1,maxW/bmp.width,maxH/bmp.height),w=Math.round(bmp.width*scale),h=Math.round(bmp.height*scale),c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(bmp,0,0,w,h);bmp.close?.();let q=quality,data=c.toDataURL('image/jpeg',q);while(data.length>1600000&&q>.48){q-=.08;data=c.toDataURL('image/jpeg',q)}if(data.length>1750000)throw new Error('image too large');return data;
  }
  async function saveCloudVisual({hero=null,body=null,clearHero=false,clearBody=false}){
    const pin=prompt('主催者PINを入力してください');if(pin===null)return false;
    const payload={p_pin:pin,p_hero_image_data:hero,p_body_image_data:body,p_clear_hero:!!clearHero,p_clear_body:!!clearBody};
    await api('rpc/save_app_visual_settings_by_pin',{method:'POST',body:JSON.stringify(payload)});await loadPublicVisuals();return true;
  }
  function addDesignEditor(){
    const more=document.querySelector('#moreView .panel');if(!more||document.getElementById('moguDesignEditor'))return;
    const box=document.createElement('details');box.id='moguDesignEditor';box.className='moguDesignEditor';box.innerHTML=`<summary>🎨 公開デザインを編集</summary><div class="moguDesignEditorBody"><p class="designPublicNote">ここで変更すると、もぐマップを見る全員に反映されます。</p><label><b>トップ画像</b><input id="moguHeroFile" type="file" accept="image/*"></label><div class="editorRow"><button id="moguHeroSave" type="button">トップ画像を公開する</button><button id="moguHeroClear" type="button">元に戻す</button></div><label><b>アプリ全体の背景画像</b><input id="moguBodyFile" type="file" accept="image/*"></label><div class="editorRow"><button id="moguBodySave" type="button">背景画像を公開する</button><button id="moguBodyClear" type="button">元に戻す</button></div><p id="moguDesignMsg" class="muted"></p><small>画像は自動で軽量化して保存します。主催者PINが必要です。</small></div>`;more.appendChild(box);
    const msg=box.querySelector('#moguDesignMsg');
    async function publish(kind){const input=box.querySelector(kind==='hero'?'#moguHeroFile':'#moguBodyFile'),file=input.files?.[0];if(!file){msg.textContent='先に画像を選んでください。';return}msg.textContent='画像を軽量化しています…';try{const data=await compressImage(file,kind==='hero'?1800:1600,kind==='hero'?1000:1400,.84);msg.textContent='公開設定を保存しています…';const ok=await saveCloudVisual(kind==='hero'?{hero:data}:{body:data});if(ok)msg.textContent='✅ 全ユーザー向けの画像を更新しました。'}catch(e){msg.textContent=e?.message?.includes('pin')?'主催者PINを確認してください。':'画像を保存できませんでした。別の画像でお試しください。'}}
    box.querySelector('#moguHeroSave').onclick=()=>publish('hero');box.querySelector('#moguBodySave').onclick=()=>publish('body');
    box.querySelector('#moguHeroClear').onclick=async()=>{try{if(await saveCloudVisual({clearHero:true}))msg.textContent='✅ トップ画像を初期デザインに戻しました。'}catch(e){msg.textContent='主催者PINを確認してください。'}};
    box.querySelector('#moguBodyClear').onclick=async()=>{try{if(await saveCloudVisual({clearBody:true}))msg.textContent='✅ 全体背景を初期デザインに戻しました。'}catch(e){msg.textContent='主催者PINを確認してください。'}};
  }
  async function boot(){addHero();addFoodStrip();addDesignEditor();syncActive();await loadPublicVisuals();const observer=new MutationObserver(()=>requestAnimationFrame(syncActive));document.querySelectorAll('.view').forEach(v=>observer.observe(v,{attributes:true,attributeFilter:['class']}));const rally=document.getElementById('rallyArea');if(rally)observer.observe(rally,{subtree:true,attributes:true,attributeFilter:['class']});document.addEventListener('click',()=>setTimeout(syncActive,60),true)}
  window.syncMoguActivePage=syncActive;window.applyMoguVisuals=applyVisuals;window.reloadMoguVisuals=loadPublicVisuals;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();