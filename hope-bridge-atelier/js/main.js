(function(){
  var reduce = false;
  var loader = document.getElementById('loader');
  var welcome = document.getElementById('welcome');
  function seen(){ try{ return sessionStorage.getItem('hb-welcome')==='1'; }catch(e){ return false; } }
  function markSeen(){ try{ sessionStorage.setItem('hb-welcome','1'); }catch(e){} }
  function openWelcome(){ if(!welcome) return; welcome.setAttribute('aria-hidden','false'); var b=welcome.querySelector('.btn'); if(b) b.focus({preventScroll:true}); }
  function closeWelcome(){ if(!welcome) return; welcome.setAttribute('aria-hidden','true'); markSeen(); }
  if(loader) setTimeout(function(){
    loader.classList.add('done');
    if(welcome && !seen()) setTimeout(openWelcome, 350);
  }, reduce ? 0 : 1500);
  if(welcome){
    welcome.querySelectorAll('[data-close]').forEach(function(el){ el.addEventListener('click', closeWelcome); });
    welcome.addEventListener('click', function(e){ if(e.target===welcome) closeWelcome(); });
  }

  // menu
  var menu=document.getElementById('menu'), mo=document.getElementById('menuOpen');
  function setMenu(open){ menu.classList.toggle('open',open); menu.setAttribute('aria-hidden',String(!open)); mo.setAttribute('aria-expanded',String(open)); }
  mo.addEventListener('click',function(){ setMenu(true); });
  menu.querySelectorAll('[data-mclose]').forEach(function(el){ el.addEventListener('click',function(){ setMenu(false); }); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ setMenu(false); closeWelcome(); } });

  // tabs
  var tabs=document.querySelectorAll('.tab');
  tabs.forEach(function(t){ t.addEventListener('click',function(){
    tabs.forEach(function(x){ x.setAttribute('aria-selected','false'); document.getElementById(x.getAttribute('aria-controls')).hidden=true; });
    t.setAttribute('aria-selected','true'); document.getElementById(t.getAttribute('aria-controls')).hidden=false;
  }); });

  // works slider
  var tr=document.getElementById('worksTrack');
  if(tr){
  function step(){ var c=tr.querySelector('.polaroid'); return c ? c.getBoundingClientRect().width+18 : 240; }
  document.getElementById('wPrev').addEventListener('click',function(){ tr.scrollBy({left:-step(),behavior:'smooth'}); });
  document.getElementById('wNext').addEventListener('click',function(){ tr.scrollBy({left:step(),behavior:'smooth'}); });
  }

  var at=document.getElementById('animTrack');
  if(at){
  function astep(){ var c=at.querySelector('figure'); return c ? c.getBoundingClientRect().width+14 : 180; }
  document.getElementById('aPrev').addEventListener('click',function(){ at.scrollBy({left:-astep()*2,behavior:'smooth'}); });
  document.getElementById('aNext').addEventListener('click',function(){ at.scrollBy({left:astep()*2,behavior:'smooth'}); });
  if(!reduce){ setInterval(function(){ if(at.matches(':hover')) return; var max=at.scrollWidth-at.clientWidth; at.scrollBy({left: at.scrollLeft>=max-4 ? -max : astep(), behavior:'smooth'}); }, 3200); }
  }

  // words slider
  var poses=['c_think','c_idea','c_hug','c_cheer','c_point','c_banzai'];
  if(document.getElementById('wordsStage')){
  var qs=document.querySelectorAll('#wordsStage .quote'), qi=0, qc=document.getElementById('qCount'), timer;
  function showQ(n){ qs[qi].classList.remove('on'); qi=(n+qs.length)%qs.length; qs[qi].classList.add('on'); qc.textContent=(qi+1)+' / '+qs.length; var ch=document.getElementById('qChara'); if(ch) ch.src='img/'+poses[qi]+'.webp'; }
  function auto(){ clearInterval(timer); if(!reduce) timer=setInterval(function(){ showQ(qi+1); },6000); }
  document.getElementById('qPrev').addEventListener('click',function(){ showQ(qi-1); auto(); });
  document.getElementById('qNext').addEventListener('click',function(){ showQ(qi+1); auto(); });
  auto();
  }

  // reveal on scroll (elements stay visible until observed)
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting && e.boundingClientRect.top>0){ e.target.classList.add('in'); io.unobserve(e.target);} }); },{threshold:.15});
    document.querySelectorAll('.reveal').forEach(function(el){ if(el.getBoundingClientRect().top>innerHeight) io.observe(el); });
  }

  // page top
  var pt=document.getElementById('pagetop');
  addEventListener('scroll',function(){ pt.classList.toggle('show',scrollY>500); },{passive:true});
  pt.addEventListener('click',function(){ scrollTo({top:0,behavior:reduce?'auto':'smooth'}); });

  // motto write-in
  (function(){ var m=document.getElementById('motto'); if(!m||reduce||!('IntersectionObserver' in window)) return;
    if(m.getBoundingClientRect().top < innerHeight) return;
    m.classList.add('hold');
    var o=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ m.classList.remove('hold'); m.classList.add('go'); o.disconnect(); } }); },{threshold:.35});
    o.observe(m); })();

  // "だから次は、私の番。" pop-in + tap jelly
  (function(){ var t=document.getElementById('turn'); if(!t) return;
    t.addEventListener('click',function(){ t.classList.remove('jelly','go'); void t.offsetWidth; t.classList.add('jelly'); });
    t.addEventListener('animationend',function(e){ if(e.animationName==='tJelly') t.classList.remove('jelly'); });
    if(reduce||!('IntersectionObserver' in window)||t.getBoundingClientRect().top<innerHeight) return;
    t.classList.add('hold');
    var o=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ t.classList.remove('hold'); t.classList.add('go'); o.disconnect(); } }); },{threshold:.5});
    o.observe(t); })();

  // signature: hand writes りーたん like a whiteboard animation
  (function(){
    var board=document.getElementById('signboard'); if(!board) return;
    var svg=board.querySelector('svg'), hand=board.querySelector('.hand'), strokes=[].slice.call(svg.querySelectorAll('.st'));
    var TIPX=0.03, TIPY=0.002, running=false, done=false;
    strokes.forEach(function(p){ var L=p.getTotalLength(); p._len=L; p.style.strokeDasharray=L; });
    function hideAll(){ strokes.forEach(function(p){ p.style.strokeDashoffset=p._len; }); }
    function showAll(){ strokes.forEach(function(p){ p.style.strokeDashoffset=0; }); }
    function toBoard(p,l){ var pt=p.getPointAtLength(l), m=p.getScreenCTM(), b=board.getBoundingClientRect(), sp=svg.createSVGPoint(); sp.x=pt.x; sp.y=pt.y; sp=sp.matrixTransform(m); return {x:sp.x-b.left-board.clientLeft, y:sp.y-b.top-board.clientTop}; }
    var cur={x:0,y:0};
    function place(x,y,wob){ cur={x:x,y:y}; var hw=hand.offsetWidth, hh=hand.offsetHeight; hand.style.transform='translate('+(x-TIPX*hw)+'px,'+(y-TIPY*hh+(wob||0))+'px) rotate('+((wob||0)*0.6)+'deg)'; }
    function tween(dur,fn){ return new Promise(function(res){ var t0=performance.now(); (function f(t){ var k=Math.min(1,(t-t0)/dur); fn(k); if(k<1) requestAnimationFrame(f); else res(); })(t0); }); }
    function ease(k){ return k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2; }
    function moveTo(x,y,dur){ var a={x:cur.x,y:cur.y}; return tween(dur,function(k){ var e=ease(k); place(a.x+(x-a.x)*e, a.y+(y-a.y)*e - Math.sin(Math.PI*k)*14); }); }
    function draw(p){ var L=p._len, dur=Math.max(160,L*3.4); return tween(dur,function(k){ var l=L*k; p.style.strokeDashoffset=L-l; var q=toBoard(p,l); place(q.x,q.y,Math.sin(k*20)*1.2); }); }
    async function run(){
      if(running) return; running=true; hideAll();
      var W=board.clientWidth, H=board.clientHeight;
      place(W+90,H+180); hand.style.opacity=1; await new Promise(function(r){ setTimeout(r,120); });
      for(var i=0;i<strokes.length;i++){ var st=toBoard(strokes[i],0); await moveTo(st.x,st.y, i===0?650:220); await draw(strokes[i]); }
      await new Promise(function(r){ setTimeout(r,250); });
      hand.style.opacity=0; await moveTo(W+90,H+180,700); running=false; done=true;
    }
    var reduceM=false;
    if(reduceM || !('IntersectionObserver' in window)){ showAll(); hand.style.display='none'; return; }
    hideAll(); place(board.clientWidth+90, board.clientHeight+180);
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ io.disconnect(); setTimeout(run,300); } }); },{threshold:.6});
    io.observe(board);
    board.addEventListener('click',function(){ if(!running) run(); });
  })();

  // scratch-off motto
  (function(){
    var box=document.getElementById('scratch'); if(!box) return;
    var cv=box.querySelector('canvas'), ctx=cv.getContext('2d'), er=box.querySelector('.sc-eraser'), crumbs=box.querySelector('.sc-crumbs');
    var reduceM=false;
    var dpr=Math.min(2,window.devicePixelRatio||1), W=0,H=0, done=false, last=null, moves=0, touched=false;
    function reveal(){ if(done) return; done=true; box.classList.remove('hint','rubbing'); box.classList.add('done'); }
    function paint(){
      var r=cv.getBoundingClientRect(); W=r.width; H=r.height; if(!W) return;
      cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr); ctx.setTransform(dpr,0,0,dpr,0,0);
      ctx.globalCompositeOperation='source-over';
      var rad=Math.min(26,H*.18);
      ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(0,0,W,H,rad); else ctx.rect(0,0,W,H);
      var g=ctx.createLinearGradient(0,0,W,H); g.addColorStop(0,'#e9e4ef'); g.addColorStop(.35,'#d7d0e0'); g.addColorStop(.55,'#f4f1f7'); g.addColorStop(.8,'#cfc7da'); g.addColorStop(1,'#e2dcea');
      ctx.fillStyle=g; ctx.fill(); ctx.save(); ctx.clip();
      for(var i=0;i<Math.round(W*H/90);i++){ ctx.fillStyle='rgba(255,255,255,'+(Math.random()*.5)+')'; ctx.fillRect(Math.random()*W,Math.random()*H,1.6,1.6); }
      ctx.strokeStyle='rgba(255,255,255,.35)'; ctx.lineWidth=1;
      for(var x=-H;x<W;x+=14){ ctx.beginPath(); ctx.moveTo(x,H); ctx.lineTo(x+H,0); ctx.stroke(); }
      var stars=['✦','♡','✧'];
      ctx.textAlign='center'; ctx.textBaseline='middle';
      for(var j=0;j<14;j++){ ctx.fillStyle=['#f3b3a3','#f7d677','#ffffff'][j%3]; ctx.font=(10+Math.random()*10)+'px sans-serif'; ctx.fillText(stars[j%3],Math.random()*W,Math.random()*H); }
      ctx.fillStyle='#7a6488'; ctx.font='700 '+Math.max(14,Math.min(22,W*.045))+'px "Yomogi","Zen Maru Gothic",sans-serif';
      ctx.fillText('けしゴムで こすってみてね', W/2, H/2-2);
      ctx.font=Math.max(11,Math.min(14,W*.03))+'px "Zen Maru Gothic",sans-serif'; ctx.fillStyle='#8f7d9c';
      ctx.fillText('なにが出てくるかな？', W/2, H/2+Math.max(18,W*.05));
      ctx.restore();
    }
    function pos(e){ var r=cv.getBoundingClientRect(); return {x:e.clientX-r.left, y:e.clientY-r.top}; }
    function boxPos(e){ var r=box.getBoundingClientRect(); return {x:e.clientX-r.left, y:e.clientY-r.top}; }
    function scratchAt(p){
      var R=Math.max(16,W*.055);
      ctx.globalCompositeOperation='destination-out'; ctx.lineCap='round'; ctx.lineJoin='round'; ctx.lineWidth=R*2;
      ctx.beginPath(); if(last){ ctx.moveTo(last.x,last.y); } else { ctx.moveTo(p.x-.1,p.y); } ctx.lineTo(p.x,p.y); ctx.stroke(); last=p;
    }
    function crumb(bp){ if(reduceM||Math.random()>.45) return; var c=document.createElement('span'); c.style.left=bp.x+'px'; c.style.top=bp.y+'px';
      c.style.setProperty('--dx',(Math.random()*40-20)+'px'); c.style.setProperty('--r',(Math.random()*360)+'deg'); c.style.background=['#cfc6d6','#e5dfeb','#b8aec4'][Math.floor(Math.random()*3)];
      crumbs.appendChild(c); setTimeout(function(){ c.remove(); },950); }
    function cleared(){ var d=ctx.getImageData(0,0,cv.width,cv.height).data, n=0, t=0; for(var i=3;i<d.length;i+=4*24){ t++; if(d[i]<40) n++; } return n/t; }
    var down=false;
    function moveEraser(e){ var bp=boxPos(e); er.style.left=bp.x+'px'; er.style.top=bp.y+'px'; return bp; }
    cv.addEventListener('pointerdown',function(e){ if(done) return; down=true; touched=true; box.classList.remove('hint'); box.classList.add('rubbing'); last=null; try{cv.setPointerCapture(e.pointerId);}catch(_){} scratchAt(pos(e)); moveEraser(e); });
    cv.addEventListener('pointermove',function(e){ if(done) return; var bp=moveEraser(e); if(e.pointerType==='mouse' && !box.classList.contains('hint')) box.classList.add('rubbing');
      if(!down) return; scratchAt(pos(e)); crumb(bp); if(++moves%12===0 && cleared()>.5) reveal(); });
    function up(){ down=false; last=null; if(!done && cleared()>.5) reveal(); }
    cv.addEventListener('pointerup',up); cv.addEventListener('pointercancel',up);
    cv.addEventListener('pointerleave',function(){ if(!down) box.classList.remove('rubbing'); });
    box.querySelector('.sc-skip').addEventListener('click',reveal);
    if(reduceM){ reveal(); return; }
    paint();
    var rt; addEventListener('resize',function(){ if(done) return; clearTimeout(rt); rt=setTimeout(function(){ if(!touched) paint(); },200); });
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting && !touched && !done) box.classList.add('hint'); }); },{threshold:.6});
      io.observe(box);
    } else box.classList.add('hint');
  })();

  // character tap
  document.querySelectorAll('.chara-tap').forEach(function(c){ c.addEventListener('click',function(){ c.classList.remove('boing'); void c.offsetWidth; c.classList.add('boing'); }); c.addEventListener('animationend',function(e){ if(e.animationName==='boing') c.classList.remove('boing'); }); });

  // FV: girl tap → hearts burst, bubble text
  (function(){
    var girl=document.querySelector('.fv2 .girl'), burst=document.getElementById('burst'), bt=document.getElementById('bubbleText');
    if(!girl) return;
    var hearts=['img/fv/heart1.webp','img/fv/heart2.webp','img/fv/heart3.webp','img/fv/spark1.webp','img/fv/spark2.webp'];
    girl.addEventListener('click',function(){
      girl.classList.remove('boing'); void girl.offsetWidth; girl.classList.add('boing');
      if(reduce) return;
      for(var i=0;i<9;i++){ var im=document.createElement('img'); im.src=hearts[i%hearts.length]; im.alt='';
        var ang=(-160+i*(140/8))*Math.PI/180, d=90+Math.random()*70;
        im.style.left='54%'; im.style.top='50%';
        im.style.setProperty('--dx',Math.cos(ang)*d+'px'); im.style.setProperty('--dy',Math.sin(ang)*d+'px'); im.style.setProperty('--rot',(Math.random()*60-30)+'deg');
        burst.appendChild(im); setTimeout((function(n){return function(){n.remove();};})(im),1300); }
    });
    girl.addEventListener('animationend',function(e){ if(e.animationName==='boing') girl.classList.remove('boing'); });
    var lines=['どっちから見る？','つくってほしいは右へ！','つながりたいは左へ！','タップしてみてね♡'], li=0;
    if(!reduce) setInterval(function(){ li=(li+1)%lines.length; bt.style.opacity=0; setTimeout(function(){ bt.textContent=lines[li]; bt.style.opacity=1; },250); },3400);
    document.querySelectorAll('.fv2 .house').forEach(function(h){ h.addEventListener('mouseenter',function(){ bt.textContent = h.classList.contains('shop') ? 'つながりたいは左へ！' : 'つくってほしいは右へ！'; }); });
  })();

  // copy LINE URL
  var cb=document.getElementById('copyBtn'); if(cb) cb.addEventListener('click',function(){
    var btn=this, txt=document.getElementById('lineUrl').textContent;
    function sel(){ var r=document.createRange(); r.selectNodeContents(document.getElementById('lineUrl')); var s=getSelection(); s.removeAllRanges(); s.addRange(r); btn.textContent='選択しました'; }
    try{ navigator.clipboard.writeText(txt).then(function(){ btn.textContent='コピーしました'; },sel); }catch(e){ sel(); }
  });
})();
