function rallyBadgeHtml(s){return s.stamp_rally_enabled?'<div class="rallyBadge">🎫 スタンプラリー参加</div>':''}
function rallyNoteHtml(s){return s.stamp_rally_enabled&&s.stamp_rally_note?'<div class="rallyNote"><b>スタンプ条件</b><br>'+esc(s.stamp_rally_note)+'</div>':''}
renderShops=function(){const list=filtered();$('resultCount').textContent=list.length+'件';$('shopList').innerHTML=list.length?list.map(s=>`<article class="shop ${s.stamp_rally_enabled?'rallyShop':''}" onclick="openDetail('${s.id}')">${rallyBadgeHtml(s)}<div class="cat">${esc(s.main_category)} › ${esc(s.subcategory||'その他')}</div><h3>${esc(s.name)}</h3><div class="muted">📍 ${esc(area(s.address))}</div><p>${esc(s.description||'')}</p>${rallyNoteHtml(s)}<div class="actions"><button class="btn small">詳しく見る</button><button class="btn green small" onclick="event.stopPropagation();navigateShop('${s.id}')">経路</button></div></article>`).join(''):'<div class="empty">該当する店舗・サービスがありません</div>';clusters.clearLayers();let pinCount=0;list.forEach(s=>{if(!Number.isFinite(+s.latitude)||!Number.isFinite(+s.longitude))return;let opt={};if(s.stamp_rally_enabled)opt.icon=L.divIcon({className:'',html:'<div class="rallyPin">🎫</div>',iconSize:[34,34],iconAnchor:[17,17],popupAnchor:[0,-16]});const m=L.marker([+s.latitude,+s.longitude],opt).bindPopup(`${s.stamp_rally_enabled?'<b style="color:#a34d00">🎫 スタンプラリー参加</b><br>':''}<b>${esc(s.name)}</b><br><small>${esc(s.main_category)} › ${esc(s.subcategory||'その他')}</small>${s.stamp_rally_note?`<br><small>${esc(s.stamp_rally_note)}</small>`:''}<div class="actions"><button class="btn small" onclick="openDetail('${s.id}')">詳細を見る</button></div>`);clusters.addLayer(m);pinCount++});$('mapStatus').textContent=pinCount+'件をピン表示';if(clusters.getLayers().length){const b=clusters.getBounds();if(b.isValid())map.fitBounds(b,{padding:[20,20],maxZoom:11})}}
renderRally=function(){const a=$('rallyArea'),rallyShops=shops.filter(s=>s.stamp_rally_enabled).sort((x,y)=>(x.rally_number||999)-(y.rally_number||999));const cards=rallyShops.map(s=>`<button type="button" class="rallyPreCard" onclick="openRallyShop('${s.id}')"><span class="rallyCardType">${esc(s.main_category||'その他')}</span><b>🎫 ${esc(s.name)}</b>${s.stamp_rally_note?`<span class="muted">${esc(s.stamp_rally_note)}</span>`:'<span class="muted">スタンプ対象スポット</span>'}</button>`).join('');if(!participant){a.innerHTML=`<h2>🎫 ${esc(settings.rally_title||'北海道スタンプラリー')}</h2><div class="rallyIntro"><b>飲食店だけじゃなく、サービス・サロン・教室・相談・イベント出店なども参加できます。</b><br>現在の参加スポット：${rallyShops.length}件<br>下のカードをタップすると詳細・行き方を確認できます。</div>${typeof publicParticipantCountHtml==='function'?publicParticipantCountHtml():''}<label for="participantEntryId"><b>参加者ID（任意）</b></label><input id="participantEntryId" class="rallyInput" maxlength="80" autocomplete="off" placeholder="会員番号など（なくても参加できます）"><label for="nickname"><b>ニックネーム（必須）</b></label><input id="nickname" class="rallyInput" maxlength="40" autocomplete="nickname" placeholder="ニックネーム"><div class="actions"><button class="btn" onclick="startRally()">スタンプラリーに参加する</button></div><p class="muted">IDとニックネームは管理者だけが確認できます。</p><h3>🎫 スタンプ対象スポット</h3><div class="rallyPreGrid">${cards}</div>`;return}const got=progress?.stamp_count||stampIds.size,total=progress?.total_shops||rallyShops.length;a.innerHTML=`<h2>🎫 ${esc(participant.nickname)}さん</h2>${typeof publicParticipantCountHtml==='function'?publicParticipantCountHtml():''}<h3>${got} / ${total}スポット</h3><div class="progress"><div style="width:${total?got/total*100:0}%"></div></div>${progress?.completed?`<div class="notice"><h2>🎉 全参加スポットクリア！</h2><strong>達成番号：${esc(progress.completion_code||'発行中')}</strong><p>${esc(settings.reward_description||'この画面を主催者へお見せください。')}</p></div>`:`<p>あと${Math.max(total-got,0)}スポット！</p>`}<p class="rallyGuide">参加スポットをタップして詳細を開き、会計・サービス利用・イベント参加時など、各スポットの条件を満たしたらスタンプを受け取ってください。</p><div class="stampGrid">${rallyShops.map(s=>`<button type="button" class="stamp stampTap ${stampIds.has(s.id)?'got':''}" onclick="openRallyShop('${s.id}')"><span class="rallyCardType">${esc(s.main_category||'その他')}</span><b>#${String(s.rally_number||'--').padStart(4,'0')}</b><br>${stampIds.has(s.id)?'✅ ':''}${esc(s.name)}${s.stamp_rally_note?`<span class="rallyMiniNote">${esc(s.stamp_rally_note)}</span>`:''}</button>`).join('')}</div>`}

const baseOpenShopEditorLinksV5=window.openShopEditor;
window.openShopEditor=function(id){
  const s=shops.find(x=>x.id===id);
  baseOpenShopEditorLinksV5(id);
  const form=$('shopForm'); if(!form||form.querySelector('[name="p_google_listing_url"]'))return;
  const error=$('formError');
  error.insertAdjacentHTML('beforebegin',`<div class="formGrid"><h3 class="field full">Google・UWリンク</h3>${field('p_google_listing_url','Google店舗ページURL',s?.google_listing_url,'url','full')}<p class="field full muted">Googleマップの店舗ページや「共有」で取得したGoogle URLを入力してください。</p>${form.querySelector('[name="p_uw_url"]')?'':field('p_uw_url','UWページURL',s?.uw_url,'url','full')}<p class="field full muted">UWページURLを入れると「UWコミュページを見る」ボタンが表示されます。</p></div>`);
  form.onsubmit=saveShop;
};

function shopSaveErrorMessageV5(err){
  const raw=String(err?.message||''); let message=raw; try{message=JSON.parse(raw).message||raw}catch{}
  if(message.includes('Invalid PIN'))return '店舗PINまたは管理者PINが違います。';
  if(message.includes('Invalid Google listing URL'))return 'Google店舗ページURLは Googleマップ／share.google のURLを入力してください。';
  if(message.includes('Invalid URL'))return 'URLは https:// から始まる正しい形式で入力してください。';
  return '保存できませんでした。通信状態と入力内容を確認してください。';
}

window.saveShop=async function(e){
  e.preventDefault();
  if(fallback)return $('formError').textContent='オフライン表示中は保存できません。通信後に再度お試しください。';
  const f=new FormData(e.currentTarget),body=Object.fromEntries(f.entries());
  body.p_stamp_rally_enabled=f.has('p_stamp_rally_enabled');
  body.p_spot_job_enabled=f.has('p_spot_job_enabled');
  body.p_volunteer_enabled=f.has('p_volunteer_enabled');
  body.p_spot_job_hourly_wage=body.p_spot_job_hourly_wage?Number(body.p_spot_job_hourly_wage):null;
  body.p_google_listing_url=body.p_google_listing_url||'';
  body.p_uw_url=body.p_uw_url||'';
  for(const k of Object.keys(body))if(k.endsWith('_url')&&body[k]&&!safe(body[k]))return $('formError').textContent='URLは https:// から入力してください。';
  const btn=e.submitter; btn.disabled=true; btn.textContent='保存中…'; $('formError').textContent='';
  try{
    const d=await api('rpc/save_shop_profile_links_v2_by_pin',{method:'POST',body:JSON.stringify(body)}),updated=Array.isArray(d)?d[0]:d;
    if(updated){const i=shops.findIndex(x=>x.id===updated.id);if(i>=0)shops[i]=updated;}
    closeModal('editModal'); initFilters(); renderAll(); openDetail(body.p_shop_id); alert('店舗情報・Google・UWリンクを保存しました。');
  }catch(err){$('formError').textContent=shopSaveErrorMessageV5(err);btn.disabled=false;btn.textContent='保存する';}
};