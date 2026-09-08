/* Hokkaido MOGU Map v4: Hokkaido-first precise pins + Google navigation */
(() => {
  const JAPAN_BOUNDS = L.latLngBounds([[20.0, 122.0], [46.2, 154.5]]);
  const HOKKAIDO_BOUNDS = L.latLngBounds([[41.25, 139.1], [45.65, 145.95]]);
  const HOKKAIDO_CENTER = [43.35, 142.6];
  const isPrecise = s => s && s.map_location_status === 'verified' && Number.isFinite(+s.latitude) && Number.isFinite(+s.longitude);
  const hasGoogleListing = s => !!(s && s.google_listing_verified && safe(s.google_listing_url));
  const communityLink = s => safe(s?.community_url) || safe(s?.uw_url) || safe(s?.point_purchase_url) || '';
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

  function applyJapanBounds(){
    if(!window.map) return;
    map.setMaxBounds(JAPAN_BOUNDS);
    map.options.maxBoundsViscosity = 1.0;
    map.setMinZoom(5);
    map.setMaxZoom(18);
    map.eachLayer(layer => {
      if(layer instanceof L.TileLayer){
        layer.options.noWrap = true;
        layer.options.bounds = JAPAN_BOUNDS;
        layer.redraw();
      }
    });
  }

  function focusHokkaido(){
    if(!window.map) return;
    map.fitBounds(HOKKAIDO_BOUNDS,{padding:[18,18],maxZoom:7});
  }
  window.focusHokkaido = focusHokkaido;

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
    alert('この店舗・サービスは住所・位置を確認中のため、地図には表示していません。');
  };

  window.renderShops = function(){
    const list = filtered();
    $('resultCount').textContent = list.length + '件';
    $('shopList').innerHTML = list.length ? list.map(s => {
      const precise = isPrecise(s);
      const rally = s.stamp_rally_enabled;
      const primary = precise ? `<button class="btn green small" onclick="event.stopPropagation();navigateShop('${s.id}')">Googleマップで行く</button>` : (communityLink(s) ? `<button class="btn green small" onclick="event.stopPropagation();navigateShop('${s.id}')">コミュページ</button>` : '');
      return `<article class="shop ${rally?'rallyShop':''}" onclick="openDetail('${s.id}')">${rallyBadgeHtml?.(s)||''}${rally?`<div class="rallyKind">${kindLabel(s)}</div>`:''}<div class="cat">${esc(s.main_category)} › ${esc(s.subcategory||'その他')}</div><h3>${esc(s.name)}</h3><div class="muted">${precise?'📍 住所・位置確認済み':'📌 位置確認中'} ${esc(area(s.address))}</div><p>${esc(s.description||'')}</p>${typeof rallyNoteHtml==='function'?rallyNoteHtml(s):''}<div class="actions"><button class="btn small">詳しく見る</button>${primary}</div></article>`;
    }).join('') : '<div class="empty">該当する店舗・サービスがありません</div>';

    clusters.clearLayers();
    let pinCount = 0;
    list.forEach(s => {
      if(!isPrecise(s)) return;
      const rally = s.stamp_rally_enabled;
      const opt = rally ? {icon:L.divIcon({className:'',html:'<div class="rallyPin">🎫</div>',iconSize:[34,34],iconAnchor:[17,17],popupAnchor:[0,-16]})} : {};
      const m = L.marker([+s.latitude,+s.longitude], opt).bindPopup(`<b>${esc(s.name)}</b><br><small>📍 住所・位置確認済み</small>${rally?`<br><b style="color:#a34d00">🎫 スタンプラリー参加</b><br><small>${kindLabel(s)}</small>`:''}<div class="actions"><button class="btn green small" onclick="navigateShop('${s.id}')">Googleマップで行く</button><button class="btn small" onclick="openDetail('${s.id}')">詳細を見る</button></div>`);
      clusters.addLayer(m);
      pinCount++;
    });
    $('mapStatus').textContent = `${pinCount}件を正確な位置で表示｜北海道メイン`;
    applyJapanBounds();
    focusHokkaido();
  };

  const previousOpenDetail = window.openDetail;
  window.openDetail = function(id){
    const s = shops.find(x => x.id === id);
    if(!s) return;
    previousOpenDetail(id);
    const detail = $('detail');
    if(!detail) return;

    [...detail.querySelectorAll('h3')].forEach(h => {
      if(h.textContent.trim() === '店舗リンク'){
        const actions = h.nextElementSibling;
        h.style.display = 'none';
        if(actions?.classList.contains('actions')) actions.style.display = 'none';
        const maybeEmpty = actions?.nextElementSibling;
        if(maybeEmpty?.classList.contains('muted')) maybeEmpty.style.display = 'none';
      }
    });

    [...detail.querySelectorAll('button')].filter(b => b.textContent.includes('ここまでナビ')).forEach(b => b.style.display='none');

    const precise = isPrecise(s);
    const googleListing = hasGoogleListing(s);
    const community = communityLink(s);
    let routeHtml = `<h3>地図・情報</h3>${s.stamp_rally_enabled?`<div class="rallyDetailBanner">🎫 スタンプラリー参加スポット<br><span>${kindLabel(s)}</span></div>`:''}<div class="actions">`;
    if(precise) routeHtml += `<a class="btn green" target="_blank" rel="noopener" href="${esc(googleDirectionsUrl(s))}">Googleマップで行く</a>`;
    if(googleListing) routeHtml += `<a class="btn ghost" target="_blank" rel="noopener" href="${esc(s.google_listing_url)}">Google店舗情報を見る</a>`;
    if(!googleListing && community) routeHtml += `<a class="btn ghost" target="_blank" rel="noopener" href="${esc(community)}">コミュページを見る</a>`;
    routeHtml += '</div>';
    if(!precise) routeHtml += '<p class="muted">住所・位置を確認できていないため、地図ピンは表示していません。</p>';
    if(!googleListing && !community) routeHtml += '<p class="muted">Google情報・コミュページは現在未登録です。</p>';

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
