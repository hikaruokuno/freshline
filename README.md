# 株式会社FRESH LINE Webサイト

命を繋ぐ ベジタブルキャリーの静的サイトです。Cloudflare Pages と Pages Functions を使って公開します。

## デプロイ手順
1. Cloudflare Pages にリポジトリを接続します。
2. ビルド設定は不要です。ビルドコマンドは空欄、出力ディレクトリは `/` のままで公開できます。
3. `functions/api/contact.ts` を Pages Functions として配置します。

## 環境変数
Cloudflare Pages の設定で以下を追加してください。
- `RESEND_API_KEY` Resend の API キー
- `ADMIN_EMAIL` 管理者の受信先メールアドレス
- `FROM_EMAIL` 送信元メールアドレス

## お問い合わせフォーム
フォームは `/api/contact` に JSON で送信します。送信すると管理者向け通知メールとユーザー向け自動返信メールが送られます。

## 構成
- `/index.html` トップページ
- `/service/index.html` サービスページ
- `/flow/index.html` 導入の流れ
- `/faq/index.html` よくある質問
- `/contact/index.html` お問い合わせ
- `/assets/css/site.css` カスタムCSS
- `/assets/js` 共通JS
- `/functions/api/contact.ts` 送信処理
