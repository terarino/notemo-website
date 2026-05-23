# notemo.net

株式会社ノテモ コーポレートサイト。GitHub Pages で配信する静的サイト（HTML/CSS/Vanilla JS）。ビルドツール・npm 不使用、外部ライブラリは CDN のみ。

## 開発ルール

- 日本語で作業・コミットメッセージを書く
- 全ページに OGP・canonical・構造化データを設置
- 画像は WebP 形式、200KB 以下に最適化
- claude-items の main に push → GitHub Actions が `terarino/notemo-website` (= notemo.net 配信源) に自動同期 → GitHub Pages がデプロイ

## デプロイ経路

```
claude-items/projects/notemo-website/  (ソース正本)
        │  main push
        ▼
.github/workflows/sync-notemo-website.yml  (GitHub Actions)
        │  rsync --delete (scripts/ 除外)
        ▼
terarino/notemo-website main  (GitHub Pages 配信源)
        │  Pages 自動デプロイ
        ▼
https://notemo.net/
```

### 初期セットアップ (1 回のみ)

Deploy Key 方式 (PAT より明示的かつ無期限。本リポジトリ専用 / 推奨)：

```bash
# 1. ed25519 鍵ペア生成 (passphrase なし)
ssh-keygen -t ed25519 -f /tmp/notemo-deploy-key -N "" -C "notemo-website-sync@claude-items"

# 2. 公開鍵を terarino/notemo-website に Deploy Key として登録 (write 有効)
gh repo deploy-key add /tmp/notemo-deploy-key.pub \
  --repo terarino/notemo-website \
  --title "claude-items sync workflow" \
  --allow-write

# 3. 秘密鍵を claude-items の secret に登録
gh secret set NOTEMO_WEBSITE_DEPLOY_KEY \
  --repo terarino/claude-items \
  --body "$(cat /tmp/notemo-deploy-key)"

# 4. ローカルの秘密鍵は削除 (もう不要)
rm /tmp/notemo-deploy-key /tmp/notemo-deploy-key.pub

# 5. workflow を手動実行して動作確認
gh workflow run sync-notemo-website.yml --repo terarino/claude-items --ref main
gh run watch --repo terarino/claude-items
```

または `terarino/notemo-website` の Settings → Deploy keys から GUI でも登録可能。

### 注意

- `scripts/` 配下 (export_from_scf.py 等の開発専用スクリプト) は配信対象外として workflow で除外
- ソース正本は **常に claude-items 側**。`terarino/notemo-website` を直接編集すると次回 sync で上書きされる

## ブランドカラー

| 用途 | 色 |
|---|---|
| メイン（ダークグリーン） | `#04342C` |
| アクセント（グリーン） | `#1D9E75` |
| ライトグリーン | `#E1F5EE` |
| テキスト（黒／グレー） | `#111111` / `#555555` |
| 背景 | `#FFFFFF` |

## タイポグラフィ

- 日本語: Noto Sans JP（Google Fonts CDN）
- 英数字: Inter（Google Fonts CDN）
- H1: 32〜40px / 700 ／ H2: 24〜28px / 600 ／ 本文: 16px / line-height 1.8

## ディレクトリ構成

```
notemo-website/
├── index.html, services.html, cases.html, company.html, contact.html
├── blog/{index,template}.html
├── css/{style,components}.css
├── js/main.js
├── images/
└── CNAME
```

## ブログ更新手順

### A. SCF (seo-content-factory) 経由で生成する場合 (推奨 / 6000 字規模 SEO 記事)

1. SCF スキルで記事を生成 → `outputs/<YYYYMMDD>/<slug>/50_article/<slug>_article.md` を完成させる
2. `scripts/export_from_scf.py --scf-slug <slug> --category AI活用` を実行
   - HTML 生成 + OGP 画像 (1200x630 WebP) + `blog/index.html` 更新まで自動
   - 詳細は [scripts/README.md](scripts/README.md) を参照
3. ローカルで確認 → `git add / commit / push`

### B. 手動で短い記事を書く場合

1. `blog/template.html` を複製して `YYYY-MM-DD-slug.html` を作成
2. `blog/index.html` の `<!-- BLOG-CARDS-START -->` 〜 `<!-- BLOG-CARDS-END -->` マーカー間に記事カードを追加
3. OGP 画像を `images/ogp/<YYYY-MM-DD>-<slug>.webp` に配置 (WebP 200KB 以下)
4. `git add / commit / push`

## レスポンシブ / レイアウト改修時のレビュー手順 (必須)

CSS / HTML レイアウトを変更したときは、**静的検証だけで完了判定しない**。
過去 (2026-05-23) に grid 子要素の `min-width: auto` 起因の崩れを静的検証で見逃し、
スマホ表示で `<article>` が画面幅の 1.5 倍まで膨張する事故があった。以下を必ず実行する。

1. ローカル HTTP サーバー起動: `python3 -m http.server 8765 --directory projects/notemo-website`
2. ヘッドレス Chrome + Playwright (`playwright-core`) で iPhone サイズ (375x812) を作成
3. 全主要ページ (index / services / cases / company / contact / blog/ / 各記事) を巡回し:
   - `document.documentElement.scrollWidth === window.innerWidth` を確認
   - `document.body.scrollWidth === window.innerWidth` を確認
   - 一時的に `html.style.overflow = body.style.overflow = 'visible'` にして
     `getBoundingClientRect().right > vw` の要素を列挙 (overflow:clip で隠れている真の犯人を可視化)
4. はみ出しゼロを確認できて初めてレビュー完了

### レイアウト系で踏みやすい地雷

- **grid / flex 子要素のデフォルト `min-width: auto`**: 内部に table・長い URL・長い英単語が
  あると、親要素が画面外まで膨張する。grid/flex 親と直接子に **`min-width: 0` を明示**する
- **table の SP 対応**: `display: block; overflow-x: auto` は内部 tr/thead/tbody の伸長を
  止められないので不十分。**`<div class="table-wrap">` でラップ + ラッパ側に overflow-x: auto** が確実
  (本サイトの blog 記事はこのパターンを採用済み)
- **長い URL / 英単語**: `body { overflow-wrap: anywhere; word-break: break-word; }` で
  ほぼ防げる (css/style.css 設定済み)
- **html / body の `overflow-x: hidden`**: `sticky` を壊すことがあるので **`overflow-x: clip`** を使う
  (clip は scroll container を作らないので sticky 副作用なし)

## Git コミット prefix

| prefix | 用途 |
|---|---|
| `feat:` | 新機能・新ページ追加 |
| `fix:` | バグ修正・誤字修正 |
| `update:` | コンテンツ更新 |
| `style:` | デザイン・CSS 変更 |
| `seo:` | SEO 関連の変更 |
| `blog:` | ブログ記事の追加・更新 |
