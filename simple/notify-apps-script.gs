/**
 * もぐマップ：お店へのメール通知（Google Apps Script）
 * お客様からメッセージ・遠隔スタンプ申請が届いたら、お店が登録したメールアドレスへお知らせします。
 * メールには「届きました」とお店アプリへのリンクだけを書き、お客様の文章は載せません（なりすまし・迷惑メール対策）。
 * 同じお店へのお知らせは5分に1通まで。
 */
const API = 'https://lgidhjxowpueglduphzp.supabase.co';
const KEY = 'sb_publishable_beqwleruXXNe93qNA6UNzg_K9fSd5ft';
const SHOP_APP_URL = 'https://ritan1107.github.io/mogamap/simple/shop.html';
const WAIT_SECONDS = 300;

function doPost(e) {
  let res;
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (d.action === 'register') res = register_(d);
    else if (d.action === 'status') res = status_(d);
    else if (d.action === 'notify') res = notify_(d);
    else res = { ok: false, message: 'unknown action' };
  } catch (err) {
    res = { ok: false, message: String(err && err.message || err) };
  }
  return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(ContentService.MimeType.JSON);
}
function doGet() { return ContentService.createTextOutput('もぐマップ 通知 OK'); }

const props_ = () => PropertiesService.getScriptProperties();
const validId_ = id => /^[A-Za-z0-9_-]{1,64}$/.test(String(id || ''));

// 店舗PINが正しいかを、もぐマップのデータベースで確認
function checkPin_(shopId, pin) {
  if (!validId_(shopId) || !pin) return false;
  const r = UrlFetchApp.fetch(API + '/rest/v1/rpc/list_purchase_submissions_for_shop_pin', {
    method: 'post', contentType: 'application/json', muteHttpExceptions: true,
    headers: { apikey: KEY, Authorization: 'Bearer ' + KEY },
    payload: JSON.stringify({ p_shop_id: shopId, p_shop_pin: String(pin) })
  });
  return r.getResponseCode() === 200;
}
function shopName_(shopId) {
  try {
    const r = UrlFetchApp.fetch(API + '/rest/v1/shop_public?select=name&id=eq.' + encodeURIComponent(shopId), {
      muteHttpExceptions: true, headers: { apikey: KEY, Authorization: 'Bearer ' + KEY }
    });
    const rows = JSON.parse(r.getContentText() || '[]');
    return (rows[0] && rows[0].name) || '';
  } catch (e) { return ''; }
}
function mask_(email) {
  if (!email) return '';
  const [u, d] = email.split('@');
  return (u.length <= 2 ? u[0] + '*' : u.slice(0, 2) + '***') + '@' + d;
}

// お店：メールアドレスを登録・変更・解除（空にすると解除）
function register_(d) {
  if (!checkPin_(d.shopId, d.pin)) return { ok: false, message: 'PINがちがいます' };
  const email = String(d.email || '').trim();
  if (!email) { props_().deleteProperty('email_' + d.shopId); return { ok: true, email: '' }; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) return { ok: false, message: 'メールアドレスの形を確認してください' };
  props_().setProperty('email_' + d.shopId, email);
  const name = shopName_(d.shopId);
  MailApp.sendEmail({
    to: email,
    subject: '【もぐマップ】メール通知を設定しました',
    body: (name ? name + ' 様\n\n' : '') +
      'もぐマップのお店アプリで、メール通知を設定しました。\n' +
      'お客様からメッセージや遠隔スタンプの申請が届くと、このアドレスにお知らせします。\n\n' +
      'お店アプリ：' + SHOP_APP_URL + '\n\n' +
      '※ 通知を止めたいときは、お店アプリの「設定」でメールアドレスを消して保存してください。\n' +
      '※ 心当たりがない場合は、このメールを無視してください。',
    name: 'もぐマップ'
  });
  return { ok: true, email: mask_(email) };
}

// お店：いまの設定を確認
function status_(d) {
  if (!checkPin_(d.shopId, d.pin)) return { ok: false, message: 'PINがちがいます' };
  return { ok: true, email: mask_(props_().getProperty('email_' + d.shopId) || '') };
}

// お客様の画面から：お店にお知らせ（文章はのせない・5分に1通まで）
function notify_(d) {
  if (!validId_(d.shopId)) return { ok: false };
  const email = props_().getProperty('email_' + d.shopId);
  if (!email) return { ok: true, sent: false };
  const cache = CacheService.getScriptCache(), key = 'n_' + d.shopId;
  if (cache.get(key)) return { ok: true, sent: false, wait: true };
  cache.put(key, '1', WAIT_SECONDS);
  const kind = d.kind === 'remote' ? '遠隔スタンプの申請' : 'メッセージ';
  const name = shopName_(d.shopId);
  MailApp.sendEmail({
    to: email,
    subject: '【もぐマップ】お客様から' + kind + 'が届きました',
    body: (name ? name + ' 様\n\n' : '') +
      'もぐマップで、お客様から' + kind + 'が届きました。\n' +
      'お店アプリの「📮 お客様」から確認してください。\n\n' +
      SHOP_APP_URL + '\n\n' +
      '※ このメールは通知専用です。返信はお店アプリから送ってください。',
    name: 'もぐマップ'
  });
  return { ok: true, sent: true };
}
