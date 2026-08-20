/* Ritan-style segmented editor for Madoka's card. */
(()=>{
  const val=id=>$(id).value.trim();
  const back='<button class="btn dark" id="v2Back">← 編集メニューへ戻る</button>';
  const save=id=>`<button class="btn save" id="${id}">☁ 保存する</button>`;
  const oldRender=render;

  render=function(){
    oldRender();
    const s=document.documentElement.style;
    s.setProperty('--bgx',(P.bgX??50)+'%');s.setProperty('--bgy',(P.bgY??50)+'%');s.setProperty('--bgscale',(P.bgScale??100)+'%');s.setProperty('--veil',P.bgVeil??.28);
    const im=$('avatar'),vd=$('avatarVideo'),ph=$('avatarPlaceholder');
    const tr=`translate(calc(-50% + ${P.avatarX||0}px),calc(-50% + ${P.avatarY||0}px)) scale(${P.avatarScale||1})`;
    im.style.transform=tr;vd.style.transform=tr;
    if(P.avatarMode==='video'&&P.avatarVideoUrl){im.style.display='none';ph.style.display='none';vd.style.display='block';if(vd.src!==P.avatarVideoUrl)vd.src=P.avatarVideoUrl;vd.muted=true;vd.play().catch(()=>{})}
    else{vd.pause();vd.style.display='none';if(P.avatarUrl){im.style.display='block';ph.style.display='none'}}
  };

  function loginV2(){
    M.classList.add('show');
    B.innerHTML='<h2>🔐 野崎さん電子名刺 編集</h2><p style="font-size:12px">6桁の編集暗証番号を入力してください。</p><input id="pinV2" type="password" inputmode="numeric" maxlength="6" autocomplete="off" placeholder="6桁の暗証番号"><button class="btn open" id="loginGoV2">編集を始める</button><button class="btn dark" id="loginCloseV2">閉じる</button>';
    $('loginCloseV2').onclick=close;$('loginGoV2').onclick=async()=>{try{PIN=val('pinV2');await api({action:'verify_pin'});menuV2()}catch(e){alert(e.message)}};
  }

  function menuV2(){
    B.innerHTML='<h2>✏️ 編集メニュー</h2><div class="editmenu"><button class="choice" id="profileV2"><span>👤</span>プロフィール編集<small>写真・名前・電話・住所</small></button><button class="choice" id="designV2"><span>🎨</span>デザイン編集<small>背景・色・位置・明るさ</small></button><button class="choice wide" id="storyV2"><span>📖</span>文章・想いを編集<small>プロフィール・活動への想い</small></button><button class="choice wide" id="linksV2"><span>🔗</span>リンク編集<small>ホームページ・予約・SNS</small></button><button class="choice wide" id="contentV2"><span>📷</span>サービス・写真編集<small>活動内容・ギャラリー8枚</small></button><button class="choice wide" id="pinV2Menu"><span>🔐</span>暗証番号を変更<small>6桁の番号を変更</small></button></div><button class="btn dark" id="menuCloseV2">閉じる</button>';
    $('profileV2').onclick=profileV2;$('designV2').onclick=designV2;$('storyV2').onclick=storyV2;$('linksV2').onclick=linksV2;$('contentV2').onclick=contentV2;$('pinV2Menu').onclick=pinV2;$('menuCloseV2').onclick=close;
  }

  async function persist(message){const j=await api({action:'save_profile',profile:P});P={...DEFAULT,...j.profile};render();toast(message);menuV2()}

  function profileV2(){
    let imageFile=null,videoFile=null,x=P.avatarX||0,y=P.avatarY||0,z=P.avatarScale||1,mode=P.avatarMode||'image';
    B.innerHTML=`${back}<h2>👤 プロフィール編集</h2><div class="group"><h3>基本情報</h3>${field('v2Name','表示名',P.name)}${field('v2Roman','英字表記',P.roman)}${area('v2Org','会社・施設名',P.organization)}${area('v2Role','肩書き',P.role)}${field('v2Lead1','キャッチコピー1',P.lead1)}${field('v2Lead2','キャッチコピー2',P.lead2)}</div><div class="group"><h3>電話・連絡先</h3><div class="row"><div>${field('v2Phone1','電話番号1',P.phone1)}${field('v2Phone1Label','電話1の表示名',P.phone1Label)}</div><div>${field('v2Phone2','電話番号2',P.phone2)}${field('v2Phone2Label','電話2の表示名',P.phone2Label)}</div></div>${field('v2Email','メール',P.email,'email')}${area('v2Address','住所',P.address)}${area('v2Hours','営業時間',P.hours)}${field('v2Map','GoogleマップURL',P.mapUrl,'url')}</div><div class="group"><h3>プロフィール写真・動画</h3><label>表示するもの</label><select id="v2AvatarMode"><option value="image" ${mode==='image'?'selected':''}>📷 写真</option><option value="video" ${mode==='video'?'selected':''}>🎬 動画</option></select><label>写真を差し替え</label><input id="v2AvatarImage" type="file" accept="image/*"><label>動画を差し替え</label><input id="v2AvatarVideo" type="file" accept="video/*"><div class="crop" id="v2Crop"><img id="v2CropImage" src="${esc(P.avatarUrl||'')}"><video id="v2CropVideo" src="${esc(P.avatarVideoUrl||'')}" autoplay muted loop playsinline></video></div><div class="range"><span>拡大</span><input id="v2Zoom" type="range" min="1" max="3" step=".01" value="${z}"><b id="v2ZoomValue">${z.toFixed(2)}×</b></div><button class="btn dark" id="v2Reset">位置を中央へ</button></div>${save('v2SaveProfile')}`;
    $('v2Back').onclick=menuV2;
    const show=()=>{mode=$('v2AvatarMode').value;$('v2CropImage').style.display=mode==='image'?'block':'none';$('v2CropVideo').style.display=mode==='video'?'block':'none';if(mode==='video')$('v2CropVideo').play().catch(()=>{})};
    const draw=()=>{const tr=`translate(calc(-50% + ${x}px),calc(-50% + ${y}px)) scale(${z})`;$('v2CropImage').style.transform=tr;$('v2CropVideo').style.transform=tr;$('v2ZoomValue').textContent=z.toFixed(2)+'×'};
    show();draw();$('v2AvatarMode').onchange=show;$('v2Zoom').oninput=e=>{z=+e.target.value;draw()};
    let drag=false,lx=0,ly=0;const crop=$('v2Crop');crop.onpointerdown=e=>{drag=true;lx=e.clientX;ly=e.clientY};crop.onpointermove=e=>{if(!drag)return;x+=e.clientX-lx;y+=e.clientY-ly;lx=e.clientX;ly=e.clientY;draw()};crop.onpointerup=()=>drag=false;
    $('v2Reset').onclick=()=>{x=0;y=0;z=1;$('v2Zoom').value=1;draw()};
    $('v2AvatarImage').onchange=e=>{imageFile=e.target.files[0];if(imageFile){$('v2CropImage').src=URL.createObjectURL(imageFile);$('v2AvatarMode').value='image';mode='image';x=0;y=0;z=1;show();draw()}};
    $('v2AvatarVideo').onchange=e=>{videoFile=e.target.files[0];if(videoFile){$('v2CropVideo').src=URL.createObjectURL(videoFile);$('v2AvatarMode').value='video';mode='video';x=0;y=0;z=1;show();draw()}};
    $('v2SaveProfile').onclick=async()=>{try{Object.assign(P,{name:val('v2Name'),roman:val('v2Roman'),organization:val('v2Org'),role:val('v2Role'),lead1:val('v2Lead1'),lead2:val('v2Lead2'),phone1:val('v2Phone1'),phone1Label:val('v2Phone1Label'),phone2:val('v2Phone2'),phone2Label:val('v2Phone2Label'),email:val('v2Email'),address:val('v2Address'),hours:val('v2Hours'),mapUrl:val('v2Map'),avatarX:x,avatarY:y,avatarScale:z,avatarMode:mode});if(imageFile)P.avatarUrl=await upload(imageFile,'avatar');if(videoFile)P.avatarVideoUrl=await upload(videoFile,'avatar-video');if(mode==='video'&&!P.avatarVideoUrl)throw Error('先に動画を選んでください');await persist('プロフィールを保存しました')}catch(e){alert(e.message)}};
  }

  function designV2(){
    let file=null,bg=P.bgImageUrl||'',x=P.bgX??50,y=P.bgY??50,z=P.bgScale??100,veil=P.bgVeil??.28;
    B.innerHTML=`${back}<h2>🎨 デザイン編集</h2><div class="group"><h3>背景写真</h3><input id="v2Background" type="file" accept="image/*"><div class="wallprev" id="v2Wall"></div><div class="range"><span>横位置</span><input id="v2BgX" type="range" min="0" max="100" value="${x}"><b>${x}%</b></div><div class="range"><span>縦位置</span><input id="v2BgY" type="range" min="0" max="100" value="${y}"><b>${y}%</b></div><div class="range"><span>拡大</span><input id="v2BgScale" type="range" min="100" max="260" value="${z}"><b>${z}%</b></div><div class="range"><span>暗さ</span><input id="v2BgVeil" type="range" min="0" max=".85" step=".05" value="${veil}"><b>${Math.round(veil*100)}%</b></div></div><div class="group"><h3>カラー</h3><div class="row"><div>${field('v2Navy','ネイビー',P.navy,'color')}${field('v2Blue','ブルー',P.blue,'color')}</div><div>${field('v2Ice','背景色',P.ice,'color')}${field('v2Accent','光の色',P.accent,'color')}</div></div></div>${save('v2SaveDesign')}`;
    $('v2Back').onclick=menuV2;const preview=()=>{const w=$('v2Wall');w.style.backgroundImage=bg?`url("${bg}")`:'linear-gradient(135deg,#102f51,#2d8fbd)';w.style.backgroundPosition=x+'% '+y+'%';w.style.backgroundSize=z+'% auto';w.style.setProperty('--preview-veil',veil)};preview();
    [['v2BgX',v=>x=v],['v2BgY',v=>y=v],['v2BgScale',v=>z=v],['v2BgVeil',v=>veil=v]].forEach(([id,set])=>$(id).oninput=e=>{set(+e.target.value);e.target.nextElementSibling.textContent=id==='v2BgVeil'?Math.round(veil*100)+'%':e.target.value+'%';preview()});
    $('v2Background').onchange=e=>{file=e.target.files[0];if(file){bg=URL.createObjectURL(file);preview()}};
    $('v2SaveDesign').onclick=async()=>{try{Object.assign(P,{navy:val('v2Navy'),blue:val('v2Blue'),ice:val('v2Ice'),accent:val('v2Accent'),bgX:x,bgY:y,bgScale:z,bgVeil:veil});if(file)P.bgImageUrl=await upload(file,'background');await persist('デザインを保存しました')}catch(e){alert(e.message)}};
  }

  function storyV2(){B.innerHTML=`${back}<h2>📖 文章・想いを編集</h2><div class="group">${area('v2ProfileText','プロフィール',P.profileText)}${area('v2MissionText','活動への想い',P.missionText)}</div>${save('v2SaveStory')}`;$('v2Back').onclick=menuV2;$('v2SaveStory').onclick=async()=>{P.profileText=val('v2ProfileText');P.missionText=val('v2MissionText');await persist('文章を保存しました')}}

  function linksV2(){let list=[...(P.links||[])];while(list.length<8)list.push({label:'',url:''});B.innerHTML=`${back}<h2>🔗 リンク編集</h2><div class="group"><h3>上部ボタン</h3>${field('v2Reserve','予約・問い合わせURL',P.reserveUrl,'url')}${field('v2Website','ホームページURL',P.website,'url')}</div><div class="group"><h3>リンクボタン（8件まで）</h3>${list.map((x,i)=>`<div class="row"><div>${field('v2LinkLabel'+i,'ボタン名 '+(i+1),x.label)}</div><div>${field('v2LinkUrl'+i,'URL '+(i+1),x.url,'url')}</div></div>`).join('')}</div>${save('v2SaveLinks')}`;$('v2Back').onclick=menuV2;$('v2SaveLinks').onclick=async()=>{P.reserveUrl=val('v2Reserve');P.website=val('v2Website');P.links=list.map((_,i)=>({label:val('v2LinkLabel'+i),url:val('v2LinkUrl'+i)})).filter(x=>x.label&&x.url);await persist('リンクを保存しました')}}

  function contentV2(){let services=[...(P.services||[])];while(services.length<6)services.push('');let gallery=[...(P.galleryPhotos||[])];while(gallery.length<8)gallery.push('');let files={};B.innerHTML=`${back}<h2>📷 サービス・写真編集</h2><div class="group"><h3>サービス（6件まで）</h3>${services.map((x,i)=>field('v2Service'+i,'サービス '+(i+1),x)).join('')}</div><div class="group"><h3>ギャラリー（8枚まで）</h3>${gallery.map((x,i)=>`<div class="fileline"><b>写真 ${i+1}</b>${x?`<img src="${esc(x)}" style="display:block;width:100%;max-height:150px;object-fit:cover;border-radius:10px;margin:7px 0">`:''}<input id="v2Gallery${i}" type="file" accept="image/*"><label><input id="v2Remove${i}" type="checkbox" style="width:auto"> この写真を外す</label></div>`).join('')}</div>${save('v2SaveContent')}`;$('v2Back').onclick=menuV2;for(let i=0;i<8;i++)$('v2Gallery'+i).onchange=e=>files[i]=e.target.files[0];$('v2SaveContent').onclick=async()=>{try{P.services=services.map((_,i)=>val('v2Service'+i)).filter(Boolean);for(let i=0;i<8;i++){if($('v2Remove'+i).checked)gallery[i]='';if(files[i])gallery[i]=await upload(files[i],'gallery-'+(i+1))}P.galleryPhotos=gallery.filter(Boolean);await persist('サービス・写真を保存しました')}catch(e){alert(e.message)}}}

  function pinV2(){B.innerHTML=`${back}<h2>🔐 暗証番号を変更</h2><div class="group"><p style="font-size:12px">新しい6桁の数字を入力してください。</p><input id="v2NewPin" type="password" inputmode="numeric" maxlength="6" placeholder="新しい6桁"></div>${save('v2SavePin')}`;$('v2Back').onclick=menuV2;$('v2SavePin').onclick=async()=>{try{const next=val('v2NewPin');if(!/^\d{6}$/.test(next))throw Error('6桁の数字を入力してください');await api({action:'change_pin',newPin:next});PIN=next;toast('暗証番号を変更しました');menuV2()}catch(e){alert(e.message)}}}

  $('editOpen').onclick=loginV2;$('navEdit').onclick=loginV2;render();
})();
