(() => {
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
          <button class="btn ghost small" type="button" onclick="openOrganizer()">🏪 店舗情報を見る</button>
        </div>
        <p class="creatorSafe">※ 店舗PIN・管理PINなどの秘密情報はここには表示しません。</p>
      </div>
    </details>`;
    more.appendChild(box);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',addCreatorInfo); else addCreatorInfo();
})();