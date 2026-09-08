// Hokkaido MOGU Map policy v3: Japan-only map, verified pins, Google/community routing.
(() => {
  const JAPAN_BOUNDS = [[20.0,122.0],[46.5,154.5]];
  const originalOpenDetail = window.openDetail;

  function verifiedMapShop(s){
    return !!s && s.map_location_status === 'verified' && Number.isFinite(+s.latitude) && Number.isFinite(+s.longitude) && String(s.address||'').trim().length >= 8;
  }
  function verifiedGoogleShop(s){
    return verifiedMapShop(s) && s.google_listing_verified === true && /^https:\/\//i.test(String(s.google_listing_url||''));
  }
  function communityUrl(s){
    return [s.community_url,s.uw_url,s.community_purchase_url,s.point_purchase_url].find(u => /^https:\/\//i.test(String(u||''))) || '';
  }
  function googleDirectionsUrl(s){
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${s.latitude},${s.longitude}`)}`;
  }

  window.navigateShop = function(id){
    const s = shops.find(x=>x.id===id);
    if(!s) return;
    if(verifiedGoogleShop(s)) return window.open(googleDirectionsUrl(s),'_blank','noopener');
    const c = communityUrl(s);
    if(c) return window.open(c,'_blank','noopener');
    alert('この店舗は現在、Google店舗情報・コミュニティページを確認中です。');
  };

  window.renderShops = function(){
    const list = filtered();
    $('resultCount').textContent = list.length+'件';
    $('shopList').innerHTML = list.length ? list.map(s=>{
      const g=verifiedGoogleShop(s), c=communityUrl(s);
      const route=g ? `<button class="btn green small" onclick="event.stopPropagation();window.open('${googleDirectionsUrl(s)}','_blank','noopener')">Googleマップ</button>` : (c ? `<button class="btn green small" onclick="event.stopPropagation();window.open('${esc(c)}','_blank','noopener')">コミュページ</button>` : '');
      return `<article class="shop ${s.stamp_rally_enabled?'rallyShop':''}" onclick="openDetail('${s.id}')">${typeof rallyBadgeHtml==='function'?rallyBadgeHtml(s):''}<div class="cat">${esc(s.main_category)} › ${esc(s.subcategory||'その他')}</div><h3>${esc(s.name)}</h3><div class="muted">${verifiedMapShop(s)?'📍 '+esc(area(s.address)):'📍 地図位置は未掲載'}</div><p>${esc(s.description||'')}</p>${typeof rallyNoteHtml==='function'?rallyNoteHtml(s):''}<div class="actions"><button class="btn small">詳しく見る</button>${route}</div></article>`;
    }).join('') : '<div class="empty">該当する店舗がありません</div>';

    if(!clusters) return;
    clusters.clearLayers();
    let pinCount=0;
    list.forEach(s=>{
      if(!verifiedMapShop(s)) return;
      let opt={};
      if(s.stamp_rally_enabled) opt.icon=L.divIcon({className:'',html:'<div class="rallyPin">🎫</div>',iconSize:[30,30],iconAnchor:[15,15],popupAnchor:[0,-14]});
      const g=verifiedGoogleShop(s), c=communityUrl(s);
      const action=g?`<a class="btn small" target="_blank" rel="noopener" href="${googleDirectionsUrl(s)}">Googleマップ</a>`:(c?`<a class="btn small" target="_blank" rel="noopener" href="${esc(c)}">コミュページ</a>`:'');
      const m=L.marker([+s.latitude,+s.longitude],opt).bindPopup(`${s.stamp_rally_enabled?'<b style="color:#a34d00">🎫 スタンプ参加店</b><br>':''}<b>${esc(s.name)}</b><br><small>${esc(s.main_category)} › ${esc(s.subcategory||'その他')}</small><div class="actions"><button class="btn small" onclick="openDetail('${s.id}')">店舗を見る</button>${action}</div>`);
      clusters.addLayer(m); pinCount++;
    });
    $('mapStatus').textContent=pinCount+'店舗を正確な位置で表示';
  };

  window.openDetail = function(id){
    if(typeof originalOpenDetail === 'function') originalOpenDetail(id);
    const s=shops.find(x=>x.id===id); if(!s) return;
    const root=$('detail'); if(!root) return;
    const headings=[...root.querySelectorAll('h3')];
    const h=headings.find(x=>x.textContent.trim()==='店舗リンク');
    if(h){
      const actions=h.nextElementSibling;
      if(actions?.classList.contains('actions')){
        const g=verifiedGoogleShop(s), c=communityUrl(s);
        if(g){
          actions.innerHTML=`<a class="btn green" target="_blank" rel="noopener" href="${googleDirectionsUrl(s)}">Googleマップで行く</a><a class="btn ghost" target="_blank" rel="noopener" href="${esc(s.google_listing_url)}">Google店舗情報を見る</a>`;
        }else if(c){
          actions.innerHTML=`<a class="btn green" target="_blank" rel="noopener" href="${esc(c)}">コミュニティページを見る</a>`;
        }else{
          actions.innerHTML='<span class="muted">Google店舗情報・コミュニティページは確認中です。</span>';
        }
      }
    }
    const addressP=[...root.querySelectorAll('p')].find(p=>p.textContent.trim().startsWith('📍'));
    if(addressP && !verifiedMapShop(s)) addressP.innerHTML='📍 <span class="muted">住所未確定のため地図には掲載していません</span>';
  };

  function applyJapanMapPolicy(){
    if(!window.map || !window.L) return;
    try{
      map.setMaxBounds(JAPAN_BOUNDS);
      map.options.maxBoundsViscosity=1.0;
      map.setMinZoom(4);
      map.eachLayer(layer=>{ if(layer instanceof L.TileLayer) map.removeLayer(layer); });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,minZoom:4,noWrap:true,bounds:JAPAN_BOUNDS,attribution:'© OpenStreetMap'}).addTo(map);
      map.fitBounds([[24.0,123.0],[45.7,149.0]],{padding:[8,8]});
      renderShops();
    }catch(e){ console.warn('Japan map policy',e); }
  }
  window.addEventListener('load',()=>setTimeout(applyJapanMapPolicy,700));
})();
