# MOGU RALLY

/rally/ は、もぐマップ本体から切り離したスタンプラリー開発版です。

## URL

- 利用者画面: `/rally/?rally=<ラリーID>`
- 主催者管理: `/rally/admin.html`

## 取得導線

NFCとQRは同じ店舗認証コードを使います。発行URLの `via=nfc` / `via=qr` を切り替えることで、どの導線から取得されたかをイベント履歴に残します。

## DB

専用テーブルは `mogu_rally_*` で名前を分け、既存の `shops` / `rally_*` / `jm_*` は直接変更しません。Supabaseには次のDDLを適用済みです。

- `create_mogu_rally_tables`
- `create_mogu_rally_core_functions`
- `create_mogu_rally_admin_functions`
- `harden_mogu_rally_policies_and_indexes`

公開側は参加トークンだけを端末に保存し、店舗コードのハッシュ・スタンプ付与・完了判定はRPC側で処理します。
