(() => {
  const CREATOR_PAGE='./ritan-denshi-meishi/';

  function cleanUwLabels(root=document){
    root.querySelectorAll('button,a').forEach(el=>{
      const t=(el.textContent||'').trim();
      if(t==='UWコミュページ'||t==='UWコミュページを見る') el.textContent='UW店舗ページを見る';
    });
    root.querySelectorAll('p').forEach(el=>{
      if((el.textContent||'').includes('UWページURLを入れると「UWコミュページを見る」ボタンが表示されます。'))
        el.textContent='UW店舗ページURLを入れると「UW店舗ページを見る」ボタンが表示されます。';
    });
    const form=root.querySelector('#shopForm');
    if(form){
      const uw=form.querySelector('[name="p_uw_url"]');
      const community=form.querySelector('[name="p_community_url"]');
      if(uw&&community){
        const wrap=community.closest('.field');
        if(wrap) wrap.remove(); else community.remove();
      }
      if(uw){
        const label=uw.closest('label');
        const span=label?.querySelector('span');
        if(span) span.textContent='UW店舗ページURL';
      }
    }
  }

  function addCreatorInfo(){
    const more=document.querySelector('#moreView .panel');
    if(!more || document.getElementById('creatorInfoBox')) return;
    const box=document.createElement('div');
    box.id='creatorInfoBox';
    box.className='creatorInfoBox';
    box.innerHTML=`<details class="creatorInfoDetails">
      <summary><span>✍️ 制作・運営</span><small>りーたん / ID 83584</small></summary>
      <div class="creatorInfoBody">
        <div class="creatorName"><b>もぐマップ 制作・運営</b><span>りーたん</span></div>
        <div class="creatorMeta">Creator ID：83584</div>
        <p>北海道の素敵なお店・サービス・人を、食べて・巡って・応援するための地域マップです。</p>
        <div class="creatorActions">
          <a class="btn ghost small" href="${CREATOR_PAGE}" target="_blank" rel="noopener">👤 りーたんのページを見る</a>
          <button class="btn ghost small" type="button" onclick="openOrganizer()">🏪 店舗情報を見る</button>
        </div>
        <p class="creatorSafe">※ 店舗PIN・管理PINなどの秘密情報はここには表示しません。</p>
      </div>
    </details>`;
    more.appendChild(box);
  }

  const observer=new MutationObserver(()=>cleanUwLabels(document));
  function boot(){
    addCreatorInfo();
    cleanUwLabels(document);
    observer.observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();