// もぐめぐりBOOK：えらんで開くガイド
(function(){
  // ---- ホーム画面に追加（お客様・お店 共通） ----
  const HOMEADD=(app,url)=>`
  <div class="tabs" data-tabs>
    <button class="on" data-pane="ios">🍎 iPhone</button>
    <button data-pane="android">🤖 Android</button>
  </div>
  <div class="tabpane on" data-pane="ios">
    <ol class="mini-steps">
      <li><b>LINEで開いたら、共有ボタン</b><span>右上の <b>□↑</b> を押す（Safariで開いている人は 3 へ）</span><img class="shot" src="img/ios-1-share.jpg" alt="LINEの画面の右上にある共有ボタン" loading="lazy"></li>
      <li><b>「Safariで開く」</b><img class="shot" src="img/ios-2-safari.jpg" alt="Safariで開くを押す" loading="lazy"></li>
      <li><b>Safariの共有ボタン → 「ホーム画面に追加」</b><span>共有ボタン <b>□↑</b> は画面の下（見当たらなければ右下の「…」の中）</span><img class="shot" src="img/ios-3-home.jpg" alt="ホーム画面に追加を押す" loading="lazy"></li>
      <li><b>右上の「追加」</b>
        <div class="fig" aria-hidden="true">
          <div class="row" style="background:#fff"><span class="gray">キャンセル</span><span>ホーム画面に追加</span><span class="btn2 blue hit">追加</span><span class="num">4</span></div>
          <div class="row"><span class="icon" style="background:linear-gradient(135deg,#64c5c6,#ef9aaa);color:#fff">も</span><span style="flex:1">${app}</span></div>
        </div>
      </li>
    </ol>
  </div>
  <div class="tabpane" data-pane="android">
    <ol class="mini-steps">
      <li><b>Chromeで開く</b><span>LINEで開いたら、右上の <b>︙</b> →「他のアプリで開く」（または「ブラウザで開く」）→ Chrome</span></li>
      <li><b>右上の「︙」を押す</b>
        <div class="fig" aria-hidden="true"><div class="bar2"><span>⌂</span><span class="url">ritan1107.github.io/mogamap/…</span><span class="icon">⬚</span><span class="icon hit" style="background:#fff">︙</span><span class="num">2</span></div></div>
      </li>
      <li><b>「ホーム画面に追加」</b><span>「アプリをインストール」と出ることもあります</span>
        <div class="fig" aria-hidden="true">
          <div class="row"><span>新しいタブ</span></div>
          <div class="row"><span>ブックマーク</span></div>
          <div class="row hit"><span>📲 ホーム画面に追加</span><span class="num">3</span></div>
          <div class="row"><span>設定</span></div>
        </div>
      </li>
      <li><b>「追加」を押す</b>
        <div class="fig" aria-hidden="true">
          <div class="row" style="background:#fff;display:block">ホーム画面に追加<div class="gray" style="margin-top:4px">${app}</div></div>
          <div class="row" style="background:#fff;justify-content:flex-end;gap:16px"><span class="gray">キャンセル</span><span class="btn2 blue hit">追加</span><span class="num">4</span></div>
        </div>
      </li>
    </ol>
  </div>
  <p class="note">開くページ：<a href="${url}">${new URL(url,location.href).href}</a></p>`;
  document.querySelectorAll('[data-include="homeadd"]').forEach(el=>{el.innerHTML=HOMEADD(el.dataset.app||'もぐマップ',el.dataset.url||'../')});

  // ---- タブ ----
  const isAndroid=/Android/i.test(navigator.userAgent);
  document.querySelectorAll('[data-tabs]').forEach(t=>{
    const root=t.parentElement;
    const pick=name=>{t.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.pane===name));root.querySelectorAll(':scope>.tabpane').forEach(p=>p.classList.toggle('on',p.dataset.pane===name))};
    t.onclick=e=>{const b=e.target.closest('button');if(b)pick(b.dataset.pane)};
    if(isAndroid)pick('android');
  });

  // ---- えらんで開くシート ----
  const bg=document.createElement('div');bg.className='sheet-bg';
  bg.innerHTML='<div class="sheet" role="dialog" aria-modal="true"><div class="sheet-top"><h2></h2><button class="close" aria-label="とじる">×</button></div><div class="sheet-body"></div><button class="back-menu">← ほかの項目をえらぶ</button></div>';
  document.body.appendChild(bg);
  const body=bg.querySelector('.sheet-body'),title=bg.querySelector('h2');
  let current=null,home=null;
  function open(id,push){
    const sec=document.getElementById(id);if(!sec||!sec.classList.contains('topic'))return;
    close(false);
    current=sec;home=sec.parentNode;
    title.textContent=sec.dataset.title||'';body.appendChild(sec);
    bg.classList.add('on');bg.querySelector('.sheet').scrollTop=0;document.body.style.overflow='hidden';
    if(push!==false)history.replaceState(null,'','#'+id);
  }
  function close(clear){
    if(current&&home){home.appendChild(current)}
    current=null;bg.classList.remove('on');document.body.style.overflow='';
    if(clear!==false)history.replaceState(null,'',location.pathname);
  }
  bg.onclick=e=>{if(e.target===bg)close()};
  bg.querySelector('.close').onclick=()=>close();
  bg.querySelector('.back-menu').onclick=()=>close();
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  document.addEventListener('click',e=>{const t=e.target.closest('[data-open]');if(t){e.preventDefault();open(t.dataset.open)}});
  const fromHash=()=>{const h=location.hash.slice(1);if(h)open(h,false)};
  window.addEventListener('hashchange',fromHash);fromHash();

  // ---- チェックリスト保存 ----
  document.querySelectorAll('.check input[type=checkbox]').forEach(c=>{
    const k='mogu_book_'+c.id;try{c.checked=localStorage.getItem(k)==='1'}catch{}
    c.onchange=()=>{try{localStorage.setItem(k,c.checked?'1':'0')}catch{}};
  });
})();
