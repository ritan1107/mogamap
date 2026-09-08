/* Hokkaido MOGU Map v3: precise pins + Japan bounds + Google navigation */
(() => {
  const JAPAN_BOUNDS = L.latLngBounds([[20.0, 122.0], [46.2, 154.5]]);
  const isPrecise = s => s && s.map_location_status === 'verified' && Number.isFinite(+s.latitude) && Number.isFinite(+s.longitude);
  const hasGoogleListing = s => !!(s && s.google_listing_verified && safe(s.google_listing_url));
  const communityLink = s => safe(s?.community_url) || safe(s?.uw_url) || safe(s?.point_purchase_url) || '';

  function googleDirectionsUrl(s){
    if(!isPrecise(s)) return '';
    return 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(`${s.latitude},${s.longitude}`);
  }

  function applyJapanBounds(){
    if(!window.map) return;
    map.setMaxBounds(JAPAN_BOUNDS);
    map.options.maxBoundsViscosity = 1.0;
    map.setMinZoom(5);
    map.setMaxZoom(18);
    // prevent world wrapping on the existing OSM tile layer
    map.eachLayer(layer => {
      if(layer instanceof L.TileLayer){
        layer.options.noWrap = true;
        layer.options.bounds = JAPAN_BOUNDS;
        layer.redraw();
      }
    });
  }

  window.navigateShop = function(id){
    const s = shops.find(x => x.id === id);
    if(!s) return;
    if(isPrecise(s)){
      window.open(googleDirectionsUrl(s), '_blank', 'noopener');
      return;
    }
    const c = communityLink(s);
    if(c){
      window.open(c, '_blank', 'noopener');
      return;
    }
    alert('この店舗は住所・位置を確認中のため、地図には表示していません。');
  };

  window.renderShops = function(){
    const list = filtered();
    $('resultCount').textContent = list.length + '件';
    $('shopList').innerHTML = list.length ? list.map(s => {
      const precise = isPrecise(s);
      const rally = s.stamp_rally_enabled;
      const primary = precise ? `<button class="btn green small" onclick="event.stopPropagation();navigateShop('${s.id}')">Googleマップで行く</button>` : (communityLink(s) ? `<button class="btn green small" onclick="event.stopPropagation();navigateShop('${s.id}')">コミュページ</button>` : '');
      return `<article class="shop ${rally?'rallyShop':''}" onclick="openDetail('${s.id}')">${rallyBadgeHtml?.(s)||''}<div class="cat">${esc(s.main_category)} › ${esc(s.subcategory||'その他')}</div><h3>${esc(s.name)}</h3><div class="muted">${precise?'📍 住所確認済み':'📌 位置確認中'} ${esc(area(s.address))}</div><p>${esc(s.description||'')}</p>${typeof rallyNoteHtml==='function'?rallyNoteHtml(s):''}<div class="actions"><button class="btn small">詳しく見る</button>${primary}</div></article>`;
    }).join('') : '<div class="empty">該当する店舗がありません</div>';

    clusters.clearLayers();
    let pinCount = 0;
    list.forEach(s => {
      if(!isPrecise(s)) return;
      const rally = s.stamp_rally_enabled;
      const opt = rally ? {icon:L.divIcon({className:'',html:'<div class="rallyPin">🎫</div>',iconSize:[30,30],iconAnchor:[15,15],popupAnchor:[0,-14]})} : {};
      const m = L.marker([+s.latitude,+s.longitude], opt).bindPopup(`<b>${esc(s.name)}</b><br><small>📍 住所・位置確認済み</small>${rally?'<br><small>🎫 スタンプラリー参加店</small>':''}<div class="actions"><button class="btn green small" onclick="navigateShop('${s.id}')">Googleマップで行く</button><button class="btn small" onclick="openDetail('${s.id}')">店舗を見る</button></div>`);
      clusters.addLayer(m);
      pinCount++;
    });
    $('mapStatus').textContent = `${pinCount}店舗を正確な位置で表示`;
    if(clusters.getLayers().length){
      const b = clusters.getBounds();
      if(b.isValid()) map.fitBounds(b,{padding:[24,24],maxZoom:11});
    } else {
      map.setView([36.2,138.2],5);
    }
    applyJapanBounds();
  };

  const previousOpenDetail = window.openDetail;
  window.openDetail = function(id){
    const s = shops.find(x => x.id === id);
    if(!s) return;
    previousOpenDetail(id);
    const detail = $('detail');
    if(!detail) return;

    // Hide the old generic external-link block; show only Google or community routing per current policy.
    [...detail.querySelectorAll('h3')].forEach(h => {
      if(h.textContent.trim() === '店舗リンク'){
        const actions = h.nextElementSibling;
        h.style.display = 'none';
        if(actions?.classList.contains('actions')) actions.style.display = 'none';
        const maybeEmpty = actions?.nextElementSibling;
        if(maybeEmpty?.classList.contains('muted')) maybeEmpty.style.display = 'none';
      }
    });

    const existingNavButtons = [...detail.querySelectorAll('button')].filter(b => b.textContent.includes('ここまでナビ'));
    existingNavButtons.forEach(b => b.style.display='none');

    const precise = isPrecise(s);
    const googleListing = hasGoogleListing(s);
    const community = communityLink(s);
    let routeHtml = '<h3>地図・店舗情報</h3><div class="actions">';
    if(precise) routeHtml += `<a class="btn green" target="_blank" rel="noopener" href="${esc(googleDirectionsUrl(s))}">Googleマップで行く</a>`;
    if(googleListing) routeHtml += `<a class="btn ghost" target="_blank" rel="noopener" href="${esc(s.google_listing_url)}">Google店舗情報を見る</a>`;
    if(!googleListing && community) routeHtml += `<a class="btn ghost" target="_blank" rel="noopener" href="${esc(community)}">コミュページを見る</a>`;
    routeHtml += '</div>';
    if(!precise) routeHtml += '<p class="muted">住所・位置を確認できていないため、地図ピンは表示していません。</p>';
    if(!googleListing && !community) routeHtml += '<p class="muted">Google店舗情報・コミュページは現在未登録です。</p>';

    const firstHr = detail.querySelector('hr');
    if(firstHr) firstHr.insertAdjacentHTML('beforebegin', routeHtml);
    else detail.insertAdjacentHTML('beforeend', routeHtml);
  };

  function boot(){
    if(window.map && window.shops && Array.isArray(shops)){
      applyJapanBounds();
      renderShops();
    } else {
      setTimeout(boot,120);
    }
  }
  boot();
})();
