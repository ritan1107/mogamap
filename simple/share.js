/* ===== スタンプラリーを人に教える（シェア） ===== */
(function(){
  const URL_SHARE='https://ritan1107.github.io/mogamap/';
  const TEXT='もぐマップ スタンプラリーやってるよ！\nお店をめぐってスタンプを3つ集めると景品がもらえるよ🎁\n近くの人はお店で、遠くの人は通販でも参加できるよ。\n参加は無料・名前を入れるだけ👇';
  const css=`.share-modal{position:fixed;inset:0;z-index:60;background:rgba(40,30,20,.45);display:none;align-items:flex-end;justify-content:center}
.share-modal.on{display:flex}
.share-sheet{width:100%;max-width:520px;background:#fff;border-radius:26px 26px 0 0;padding:20px 18px calc(22px + env(safe-area-inset-bottom));max-height:92vh;overflow:auto}
.share-head{display:flex;justify-content:space-between;align-items:center}
.share-head b{font-size:19px}
.share-x{border:0;background:#f3ede6;width:38px;height:38px;border-radius:50%;font-size:20px;cursor:pointer}
.share-lead{color:#8a7b6f;font-size:13.5px;font-weight:700;margin:4px 0 12px}
.share-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
.share-grid a,.share-grid button{display:flex;align-items:center;justify-content:center;gap:8px;border:0;border-radius:16px;padding:14px 8px;font:inherit;font-weight:900;font-size:15px;cursor:pointer;text-decoration:none;color:#3b3029;background:#f6f1ea;min-height:52px}
.share-grid .line{background:#06c755;color:#fff}.share-grid .main{grid-column:1/-1;background:#e0789a;color:#fff;font-size:17px}
.share-qr{margin-top:14px;text-align:center;background:#fbf6ef;border-radius:18px;padding:14px}
.share-qr svg{width:200px;height:200px;background:#fff;border-radius:12px}
.share-qr small{display:block;color:#8a7b6f;font-weight:800;font-size:12.5px;margin-top:6px}
.share-url{margin-top:6px;font-size:12px;color:#a79a8e;word-break:break-all}`;
  function ensure(){
    if(document.getElementById('shareModal'))return;
    const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
    const m=document.createElement('div');m.className='share-modal';m.id='shareModal';
    m.innerHTML=`<div class="share-sheet" role="dialog" aria-label="スタンプラリーをシェア">
      <div class="share-head"><b>📤 スタンプラリーを教える</b><button class="share-x" aria-label="とじる">×</button></div>
      <div class="share-lead">お友だちや家族に送って、いっしょに参加しよう</div>
      <div class="share-grid">
        ${navigator.share?'<button class="main" data-sh="native">📤 シェアする</button>':''}
        <a class="line" target="_blank" rel="noopener" href="https://line.me/R/msg/text/?${encodeURIComponent(TEXT+'\n'+URL_SHARE)}">LINEで送る</a>
        <button data-sh="copy">🔗 URLをコピー</button>
        <a target="_blank" rel="noopener" href="https://x.com/intent/post?text=${encodeURIComponent(TEXT)}&url=${encodeURIComponent(URL_SHARE)}">𝕏 ポスト</a>
        <a target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(URL_SHARE)}">f Facebook</a>
        <button data-sh="text">📝 紹介文コピー</button>
        <button data-sh="qr">📱 QRを見せる</button>
      </div>
      <div class="share-qr" id="shareQr" hidden><div id="shareQrSvg"></div><small>目の前の人に、スマホのカメラで読み取ってもらってね</small><div class="share-url">${URL_SHARE}</div></div>
    </div>`;
    document.body.appendChild(m);
    m.addEventListener('click',async e=>{
      if(e.target===m||e.target.closest('.share-x')){m.classList.remove('on');return}
      const b=e.target.closest('[data-sh]');if(!b)return;const k=b.dataset.sh;
      const copy=async t=>{try{await navigator.clipboard.writeText(t);(window.toast||alert)('コピーしました')}catch{(window.toast||alert)('コピーできませんでした')}};
      if(k==='native'){try{await navigator.share({title:'もぐマップ スタンプラリー',text:TEXT,url:URL_SHARE})}catch{}}
      else if(k==='copy')copy(URL_SHARE);
      else if(k==='text')copy(TEXT+'\n'+URL_SHARE);
      else if(k==='qr'){const q=document.getElementById('shareQr');q.hidden=!q.hidden;
        if(!q.hidden&&!document.getElementById('shareQrSvg').innerHTML){
          const draw=()=>{const g=qrcode(0,'M');g.addData(URL_SHARE);g.make();document.getElementById('shareQrSvg').innerHTML=g.createSvgTag({cellSize:6,margin:2,scalable:true})};
          if(window.qrcode)draw();else{const s=document.createElement('script');s.src=new URL('lib/qrcode.js?v=1',document.currentScript?.src||SHARE_BASE).href;s.onload=draw;document.head.appendChild(s)}
        }}
    });
  }
  const SHARE_BASE=document.currentScript?.src||location.href;
  window.openShare=function(){ensure();document.getElementById('shareModal').classList.add('on')};
  document.addEventListener('click',e=>{if(e.target.closest('[data-share-open]')){e.preventDefault();window.openShare()}});
})();
