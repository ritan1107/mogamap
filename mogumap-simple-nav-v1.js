(()=>{
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  function panel(id){
    $$('.panel').forEach(x=>x.classList.toggle('on',x.id===id));
    window.scrollTo({top:0,behavior:'smooth'});
    if(id==='home')setTimeout(()=>{try{map?.invalidateSize?.()}catch(e){}},80);
  }
  function clearRallyMode(){document.body.classList.remove('mogu-stamp-focus','mogu-remote-focus')}
  function rally(mode){
    clearRallyMode();
    document.body.classList.add(mode==='remote'?'mogu-remote-focus':'mogu-stamp-focus');
    panel('rally');
    const target=mode==='remote'?$('.remote-request-card'):$('#stampPin')?.closest('.card');
    setTimeout(()=>target?.scrollIntoView({behavior:'smooth',block:'start'}),80);
  }
  function mypage(){
    clearRallyMode(); panel('rally');
    setTimeout(()=>$('#rallyMyPage')?.scrollIntoView({behavior:'smooth',block:'start'}),80);
  }
  function settings(){clearRallyMode();panel('more')}
  function build(){
    const nav=$('.bottomnav'); if(!nav)return;
    nav.innerHTML=`
      <button class="bnav" data-mogu="face"><span>🎟️</span>対面スタンプ</button>
      <button class="bnav" data-mogu="remote"><span>📮</span>遠隔スタンプ</button>
      <button class="bnav on" data-mogu="map"><span>🗺️</span>マップ</button>
      <button class="bnav" data-mogu="mypage"><span>👤</span>マイページ</button>`;
    nav.addEventListener('click',e=>{
      const b=e.target.closest('[data-mogu]');if(!b)return;
      $$('.bnav',nav).forEach(x=>x.classList.toggle('on',x===b));
      const a=b.dataset.mogu;
      if(a==='face')rally('face'); else if(a==='remote')rally('remote'); else if(a==='map'){clearRallyMode();panel('home')} else mypage();
    });
    let gear=$('.mogu-gear');
    if(!gear){gear=document.createElement('button');gear.className='mogu-gear';gear.type='button';gear.setAttribute('aria-label','設定・編集');gear.title='設定・編集';gear.textContent='⚙️';document.body.appendChild(gear)}
    gear.onclick=settings;
    const more=$('#more');
    if(more&&!more.querySelector('.mogu-mode-title'))more.insertAdjacentHTML('afterbegin','<h1 class="mogu-mode-title">⚙️ 設定・編集</h1><p class="mogu-mode-note">店舗編集・管理者機能・主催者設定など、変更する操作はここにまとめています。</p>');
    const jobs=$('#jobs'); if(jobs)jobs.classList.remove('on');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
})();
