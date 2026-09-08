(() => {
  function ensureRankingBox(){
    const rally=document.getElementById('rallyArea');if(!rally)return null;
    let box=document.getElementById('publicRankingBox');
    if(!box){box=document.createElement('div');box.id='publicRankingBox';box.className='rankingPanel';rally.appendChild(box);}return box;
  }
  window.loadPublicRanking=async function(){
    const box=ensureRankingBox();if(!box)return;
    box.innerHTML='<div class="rankingLoading">ランキングを読み込んでいます…</div>';
    try{
      const data=await api('rpc/get_public_rally_ranking',{method:'POST',body:'{}'}),rows=Array.isArray(data)?data:[];
      if(!rows.length){box.innerHTML='<div class="rankingEmpty"><h3>🏆 スタンプランキング</h3><p>公開設定をONにした参加者がここに表示されます。</p></div>';return;}
      box.innerHTML=`<div class="rankingHead"><div><span>みんなの挑戦</span><h3>🏆 スタンプランキング TOP20</h3></div><small>公開ONの参加者のみ</small></div><div class="rankingList">${rows.map(r=>{const medal=r.rank_no===1?'🥇':r.rank_no===2?'🥈':r.rank_no===3?'🥉':'🏅';const promo=(r.promo_title||r.promo_text)?`<div class="rankPromo">${r.promo_title?`<b>${esc(r.promo_title)}</b>`:''}${r.promo_text?`<p>${esc(r.promo_text)}</p>`:''}${r.promo_url?`<a href="${esc(r.promo_url)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">詳しく見る →</a>`:''}</div>`:'';const count=r.show_stamp_count?`<div class="rankCount">🎫 ${r.stamp_count||0} スタンプ</div>`:'<div class="rankCount muted">🎫 スタンプ数は非公開</div>';return `<article class="rankCard rank${r.rank_no<=3?'Top':''}"><div class="rankNo">${medal}<strong>${r.rank_no}</strong></div><div class="rankMain"><div class="rankName">${esc(r.display_name||'参加者')}</div>${count}${promo}</div></article>`}).join('')}</div><p class="rankingFoot">どのお店を回ったかは公開されません。スタンプ数も参加者本人が表示・非表示を選べます。</p>`;
    }catch(e){box.innerHTML='<div class="rankingEmpty"><h3>🏆 スタンプランキング</h3><p>ランキングを読み込めませんでした。</p></div>';}
  };
  const baseRenderRally=window.renderRally;
  window.renderRally=function(){baseRenderRally();setTimeout(()=>window.loadPublicRanking(),0)};
  document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>window.loadPublicRanking(),300));
})();