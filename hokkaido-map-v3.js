/* Hokkaido MOGU Map v6: Hokkaido-only calm map interactions */
(() => {
  const HOKKAIDO_BOUNDS = L.latLngBounds([[41.15, 139.0], [45.75, 146.15]]);
  const HOKKAIDO_VIEW = L.latLngBounds([[41.35, 139.35], [45.55, 145.85]]);
  let initialFocusDone = false;
  const isPrecise = s => s && s.map_location_status === 'verified' && Number.isFinite(+s.latitude) && Number.isFinite(+s.longitude);
  const hasGoogleListing = s => !!(s && s.google_listing_verified && safe(s.google_listing_url));
  const communityLink = s => safe(s?.uw_url) || safe(s?.community_url) || '';
  const kindLabel = s => {
    const main = String(s?.main_category || s?.category || 'その他');
    if(/飲食|カフェ|食品|居酒屋|スイーツ|定食|海鮮|農産物/.test(main + ' ' + (s?.subcategory||''))) return '🍴 飲食・フード';
    if(/サービス|美容|健康|整体|サロン|占|ヒーリング|士業|教室|講師|相談|クリエイ|その他/.test(main + ' ' + (s?.subcategory||'') + ' ' + (s?.description||''))) return '✨ サービス・活動';
    return '📍 参加スポット';
  };

  function googleDirectionsUrl(s){
    if(!isPrecise(s)) return '';
    return 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(`${s.latitude},${s.longitude}`);
  }

  function applyHokkaidoBounds(){
    if(!window.map) return;
    map.setMaxBounds(HOKKAIDO_BOUNDS);
    map.options.maxBoundsViscosity = 1.0;
    map.setMinZoom(6);
    map.setMaxZoom(18);
    map.options.zoomSnap = 0.5;
    map.options.zoomDelta = 0.5;
    map.options.wheelPxPerZoomLevel = 95;
    map.options.inertia = false;
    map.options.bounceAtZoomLimits = false;
    map.eachLayer(layer => {
      if(layer instanceof L.TileLayer){
        layer.options.noWrap = true;
        layer.options.bounds = HOKKAIDO_BOUNDS;
        layer.redraw();
      }
    });
  }

  function focusHokkaido(animate=false){
    if(!window.map) return;
    map.fitBounds(HOKKAIDO_VIEW,{padding:[18,18],maxZoom:7,animate:!!animate,duration:.35});
  }
  window.focusHokkaido = focusHokkaido;

  function addHomeControl(){
    if(!window.map || document.querySelector('.moguHokkaidoHome')) return;
    const C=L.Control.extend({options:{position:'topright'},onAdd(){
      const box=L.DomUtil.create('div','leaflet-bar moguHokkaidoHome');
      const b=L.DomUtil.create('button','',box); b.type='button'; b.title='北海道全体を見る'; b.setAttribute('aria-label','北海道全体を見る'); b.innerHTML='🏠';
      L.DomEvent.disableClickPropagation(box);L.DomEvent.disableScrollPropagation(box);
      L.DomEvent.on(b,'click',()=>focusHokkaido(true));
      return box;
    }}); new C().addTo(map);
  }

  window.navigateShop = function(id){
    const s = shops.find(x => x.id === id);
    if(!s) return;
    if(isPrecise(s)) return window.open(googleDirectionsUrl(s), '_blank', 'noopener');
    const c = communityLink(s);
    if(c) return window.open(c, '_blank', 'noopener');
    alert('この店舗・サービスは住所・位置を確認中のため、地図には表示していません。');
  };
  window.openGoogleListing = function(id){const s=shops.find(x=>x.id===id);if(s&&hasGoogleListing(s))window.open(s.google_listing_url,'_blank','noopener')};
  window.openUwPage = function(id){const s=shops.find(x=>x.id===id),u=communityLink(s);if(u)window.open(u,'_blank','noopener')};

  window.renderShops = function(){
    const list = filtered();
    $('resultCount').textContent = list.length + '件';
    $('shopList').innerHTML = list.length ? list.map(s => {
      const precise=isPrecise(s),rally=s.stamp_rally_enabled,google=hasGoogleListing(s),uw=communityLink(s);
      const links=`${precise?`<button class="btn green small" onclick="event.stopPropagation();navigateShop('${s.id}')">Googleマップで行く</button>`:''}${google?`<button class="btn ghost small" onclick="event.stopPropagation();openGoogleListing('${s.id}')">Google店舗ページ</button>`:''}${uw?`<button class="btn ghost small" onclick="event.stopPropagation();openUwPage('${s.id}')">UWコミュページ</button>`:''}`;
      return `<article class="shop ${rally?'rallyShop':''}" onclick="openDetail('${s.id}')">${typeof rallyBadgeHtml==='function'?rallyBadgeHtml(s):''}${rally?`<div class="rallyKind">${kindLabel(s)}</div>`:''}<div class="cat">${esc(s.main_category)} › ${esc(s.subcategory||'その他')}</div><h3>${esc(s.name)}</h3><div class="muted">${precise?'📍 住所・位置確認済み':'📌 位置確認中'} ${esc(area(s.address))}</div><p>${esc(s.description||'')}</p>${typeof rallyNoteHtml==='function'?rallyNoteHtml(s):''}<div class="actions"><button class="btn small">詳しく見る</button>${links}</div></article>`;
    }).join('') : '<div class="empty">該当する店舗・サービスがありません</div>';

    clusters.clearLayers(); let pinCount=0;
    list.forEach(s=>{
      if(!isPrecise(s))return;
      const rally=s.stamp_rally_enabled,google=hasGoogleListing(s),uw=communityLink(s);
      const opt=rally?{icon:L.divIcon({className:'',html:'<div class="rallyPin">🎫</div>',iconSize:[34,34],iconAnchor:[17,17],popupAnchor:[0,-16]})}:{};
      const extra=`${google?`<button class="btn ghost small" onclick="openGoogleListing('${s.id}')">Google店舗ページ</button>`:''}${uw?`<button class="btn ghost small" onclick="openUwPage('${s.id}')">UWコミュページ</button>`:''}`;
      clusters.addLayer(L.marker([+s.latitude,+s.longitude],opt).bindPopup(`<b>${esc(s.name)}</b><br><small>📍 住所・位置確認済み</small>${rally?`<br><b style="color:#a34d00">🎫 スタンプラリー参加</b><br><small>${kindLabel(s)}</small>`:''}<div class="actions"><button class="btn green small" onclick="navigateShop('${s.id}')">Googleマップで行く</button>${extra}<button class="btn small" onclick="openDetail('${s.id}')">詳細を見る</button></div>`)); pinCount++;
    });
    $('mapStatus').textContent=`${pinCount}件を正確な位置で表示｜北海道のみ`;
    applyHokkaidoBounds();
    /* Important: filtering/searching must NOT move the map. Only the first load recenters. */
    if(!initialFocusDone){initialFocusDone=true;focusHokkaido(false)}
  };

  const previousOpenDetail=window.openDetail;
  window.openDetail=function(id){
    const s=shops.find(x=>x.id===id);if(!s)return;
    previousOpenDetail(id);const detail=$('detail');if(!detail)return;
    [...detail.querySelectorAll('h3')].forEach(h=>{if(h.textContent.trim()==='店舗リンク'){const actions=h.nextElementSibling;h.style.display='none';if(actions?.classList.contains('actions'))actions.style.display='none';const maybeEmpty=actions?.nextElementSibling;if(maybeEmpty?.classList.contains('muted'))maybeEmpty.style.display='none'}});
    [...detail.querySelectorAll('button')].filter(b=>b.textContent.includes('ここまでナビ')).forEach(b=>b.style.display='none');
    const precise=isPrecise(s),google=hasGoogleListing(s),uw=communityLink(s);let routeHtml=`<h3>地図・店舗情報・コミュニティ</h3>${s.stamp_rally_enabled?`<div class="rallyDetailBanner">🎫 スタンプラリー参加スポット<br><span>${kindLabel(s)}</span></div>`:''}<div class="actions">`;
    if(precise)routeHtml+=`<a class="btn green" target="_blank" rel="noopener" href="${esc(googleDirectionsUrl(s))}">Googleマップで行く</a>`;
    if(google)routeHtml+=`<a class="btn ghost" target="_blank" rel="noopener" href="${esc(s.google_listing_url)}">Google店舗ページを見る</a>`;
    if(uw)routeHtml+=`<a class="btn ghost" target="_blank" rel="noopener" href="${esc(uw)}">UWコミュページを見る</a>`;
    routeHtml+='</div>';if(!precise)routeHtml+='<p class="muted">住所・位置を確認できていないため、地図ピンは表示していません。</p>';if(!google&&!uw)routeHtml+='<p class="muted">Google店舗ページ・UWコミュページは現在未登録です。</p>';const firstHr=detail.querySelector('hr');if(firstHr)firstHr.insertAdjacentHTML('beforebegin',routeHtml);else detail.insertAdjacentHTML('beforeend',routeHtml)
  };

  function boot(){if(window.map&&window.shops&&Array.isArray(shops)){applyHokkaidoBounds();addHomeControl();renderShops()}else setTimeout(boot,120)}
  boot();
})();