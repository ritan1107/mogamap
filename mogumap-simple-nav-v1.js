(()=>{
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const panel=id=>{$$('.panel').forEach(x=>x.classList.toggle('on',x.id===id));window.scrollTo({top:0,behavior:'smooth'});if(id==='home')setTimeout(()=>{try{map?.invalidateSize?.()}catch(e){}},80)};
  const clear=()=>document.body.classList.remove('mogu-stamp-focus','mogu-remote-focus');
  function stamp(){clear();document.body.classList.add('mogu-stamp-focus');panel('rally');setTimeout(()=>$('#stampPin')?.closest('.card')?.scrollIntoView({behavior:'smooth',block:'start'}),100)}
  function remote(){clear();document.body.classList.add('mogu-remote-focus');panel('rally');setTimeout(()=>($('.remote-stamp-card')||$('.remote-request-card'))?.scrollIntoView({behavior:'smooth',block:'start'}),100)}
  function mypage(){clear();panel('rally');setTimeout(()=>$('#rallyMyPage')?.scrollIntoView({behavior:'smooth',block:'start'}),100)}
  function stores(){clear();panel('home');setTimeout(()=>($('#shopList')||$('.storelist'))?.scrollIntoView({behavior:'smooth',block:'start'}),100)}
  function menu(){clear();panel('more')}
  function buildHero(){
    const home=$('#home');if(!home||$('#moguEasyTop'))return;
    const top=document.createElement('section');top.id='moguEasyTop';top.className='mogu-easy-top';
    top.innerHTML=`<div class="mogu-hero"><div class="mogu-hero-placeholder"><span>もぐマップ</span><b>北海道スタンプラリー</b><small>トップ画像・動画は管理画面から変更できます</small></div></div><div class="mogu-top-title">何をしますか？</div><div class="mogu-main-actions"><button data-easy="stamp"><span>🎟️</span><b>スタンプを押す</b><small>お店で参加</small></button><button data-easy="book"><span>📖</span><b>スタンプ帳を見る</b><small>集めた数を確認</small></button><button data-easy="stores"><span>🔎</span><b>お店を探す</b><small>一覧から探す</small></button><button data-easy="map"><span>🗺️</span><b>地図から探す</b><small>近くのお店を見る</small></button></div>`;
    home.insertBefore(top,home.firstChild);
    top.onclick=e=>{const b=e.target.closest('[data-easy]');if(!b)return;const a=b.dataset.easy;if(a==='stamp')stamp();else if(a==='book')mypage();else if(a==='stores')stores();else{clear();panel('home');setTimeout(()=>$('#map')?.scrollIntoView({behavior:'smooth',block:'center'}),100)}};
  }
  function build(){
    document.body.classList.add('mogu-senior-ui');buildHero();
    const nav=$('.bottomnav');if(nav){nav.innerHTML=`<button class="bnav on" data-mogu="home"><span>🏠</span>トップ</button><button class="bnav" data-mogu="stamp"><span>🎟️</span>スタンプ帳</button><button class="bnav" data-mogu="map"><span>🗺️</span>お店を探す</button><button class="bnav" data-mogu="mypage"><span>👤</span>マイページ</button>`;nav.onclick=e=>{const b=e.target.closest('[data-mogu]');if(!b)return;$$('.bnav',nav).forEach(x=>x.classList.toggle('on',x===b));({home:()=>{clear();panel('home')},stamp:mypage,map:stores,mypage:mypage}[b.dataset.mogu]||(()=>{}))()}}
    let gear=$('.mogu-gear');if(!gear){gear=document.createElement('button');gear.className='mogu-gear';gear.type='button';gear.innerHTML='<span>☰</span><small>メニュー</small>';document.body.appendChild(gear)}gear.onclick=menu;
    const more=$('#more');if(more&&!more.querySelector('.mogu-mode-title'))more.insertAdjacentHTML('afterbegin','<h1 class="mogu-mode-title">☰ メニュー</h1><p class="mogu-mode-note">遠隔スタンプ・店舗編集・主催者設定など、普段あまり使わない機能はこちらです。</p><button type="button" class="btn full" id="moguRemoteMenu">📮 遠隔でスタンプをもらう</button>');
    $('#moguRemoteMenu')?.addEventListener('click',remote);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
})();