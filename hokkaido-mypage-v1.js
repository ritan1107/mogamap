(() => {
  let myPageProfile=null,myPageHistory=[];
  const fmtDate=v=>{if(!v)return '';try{return new Date(v).toLocaleString('ja-JP',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}catch{return ''}};
  function ensureMyPageUI(){
    if(!document.getElementById('myPageView')){
      const sec=document.createElement('section');sec.className='view';sec.id='myPageView';sec.innerHTML='<div class="panel panelPad" id="myPageArea"></div>';
      document.querySelector('main')?.appendChild(sec);
    }
    const nav=document.querySelector('nav.bottom');
    if(nav&&!nav.querySelector('[data-view="myPageView"]')){
      nav.style.gridTemplateColumns='repeat(5,1fr)';
      const b=document.createElement('button');b.className='tab';b.dataset.view='myPageView';b.innerHTML='<b>👤</b>マイページ';
      b.onclick=()=>openMyPage();nav.appendChild(b);
    }
  }
  function copyParticipantId(){const id=myPageProfile?.participant_entry_id||participant?.participant_entry_id;if(!id)return;navigator.clipboard?.writeText(id);alert('参加者IDをコピーしました');}
  window.copyMoguParticipantId=copyParticipantId;
  window.openMyPage=async function(){
    ensureMyPageUI();
    document.querySelectorAll('.view').forEach(x=>x.classList.toggle('on',x.id==='myPageView'));
    document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('on',x.dataset.view==='myPageView'));
    scrollTo({top:0,behavior:'smooth'});await loadMyPage();
  };
  async function loadMyPage(){
    ensureMyPageUI();const a=document.getElementById('myPageArea');if(!a)return;
    if(!participant){a.innerHTML='<div class="myEmpty"><div class="myAvatar">👤</div><h2>あなたのマイページ</h2><p>スタンプラリーに参加すると、ここに参加ID・スタンプ・購入履歴がまとまります。</p><button class="btn" onclick="switchView(\'stampView\')">🎫 スタンプラリーに参加する</button></div>';return;}
    a.innerHTML='<div class="myLoading">マイページを読み込んでいます…</div>';
    try{
      const body={p_participant_id:participant.id,p_participant_token:participant.token};
      const [p,h]=await Promise.all([api('rpc/get_participant_mypage',{method:'POST',body:JSON.stringify(body)}),api('rpc/get_participant_stamp_history',{method:'POST',body:JSON.stringify(body)})]);
      myPageProfile=Array.isArray(p)?p[0]:p;myPageHistory=Array.isArray(h)?h:[];
      if(myPageProfile){participant={...participant,nickname:myPageProfile.nickname,participant_entry_id:myPageProfile.participant_entry_id};saveParticipant(participant);}
      renderMyPage();
    }catch(e){a.innerHTML='<div class="notice">マイページを読み込めませんでした。通信状態を確認してもう一度お試しください。</div>';}
  }
  window.loadMyPage=loadMyPage;
  function renderMyPage(){
    const a=document.getElementById('myPageArea'),p=myPageProfile;if(!a||!p)return;
    const got=p.stamp_count||0,total=p.total_shops||0,pct=total?Math.min(100,got/total*100):0;
    const history=myPageHistory.length?myPageHistory.map(x=>`<div class="myHistoryRow"><div class="myHistoryIcon">${x.grant_method==='remote'?'📦':'📍'}</div><div><b>${esc(x.shop_name)}</b><small>${x.grant_method==='remote'?'遠方・オンライン':'来店'}${x.grant_note?'｜'+esc(x.grant_note):''}<br>${fmtDate(x.stamped_at)}</small></div><span>✅</span></div>`).join(''):'<div class="myNoStamp">まだスタンプはありません。参加スポットを利用して集めてみよう！</div>';
    a.innerHTML=`<div class="myHero"><div class="myAvatar">😊</div><div><span class="myHello">こんにちは</span><h2>${esc(p.nickname)}さん</h2></div></div>
      <div class="myIdCard"><span>あなたの参加者ID</span><strong>${esc(p.participant_entry_id)}</strong><p>遠方購入・通販・オンライン利用のときは、このIDをお店に伝えてください。</p><button class="btn myCopy" onclick="copyMoguParticipantId()">📋 IDをコピー</button></div>
      <div class="myHow"><b>📦 遠方から購入するとき</b><div><span>1</span>商品・サービスを購入</div><div><span>2</span>お店に参加者IDを伝える</div><div><span>3</span>お店が確認後スタンプ付与</div></div>
      <div class="myProgressCard"><div class="myProgressHead"><div><span>現在のスタンプ</span><strong>${got}<small> / ${total}</small></strong></div><div class="myPercent">${Math.round(pct)}%</div></div><div class="progress"><div style="width:${pct}%"></div></div>${p.completed?`<div class="myComplete">🎉 全スポットクリア！${p.completion_code?'<br>達成番号：<b>'+esc(p.completion_code)+'</b>':''}</div>`:`<p>あと <b>${Math.max(total-got,0)}</b> スポット！</p>`}<button class="btn ghost" onclick="switchView('stampView')">🎫 スタンプ対象スポットを見る</button></div>
      <div class="mySection"><h3>✅ 獲得したスタンプ</h3>${history}</div>
      <div class="mySection myGuide"><h3>このマイページでできること</h3><p>🪪 参加者IDを確認・コピー<br>🎫 スタンプ数を確認<br>✅ 獲得した店舗を確認<br>📦 遠方・オンライン購入のスタンプも確認</p></div>`;
  }
  const oldStart=window.startRally;
  window.startRally=async function(){
    const n=document.getElementById('nickname')?.value.trim();if(!n)return alert('ニックネームを入力してください');
    const entry=document.getElementById('participantEntryId')?.value.trim()||'';
    try{
      const d=await api('rpc/start_rally',{method:'POST',body:JSON.stringify({p_nickname:n,p_entry_id:entry})}),x=Array.isArray(d)?d[0]:d;
      saveParticipant({id:x.id||x.participant_id,token:x.participant_token,nickname:x.nickname,participant_entry_id:x.participant_entry_id});
      await refreshProgress();await openMyPage();alert('🎉 参加登録できました！マイページを作成しました。');
    }catch(e){let m=String(e?.message||'');if(m.includes('すでに使われています'))return alert('その参加者IDはすでに使われています。空欄にすると自動発行できます。');alert('参加登録できませんでした');}
  };
  const baseRefresh=window.refreshProgress;
  window.refreshProgress=async function(){await baseRefresh();if(document.getElementById('myPageView')?.classList.contains('on'))await loadMyPage();};
  ensureMyPageUI();
})();