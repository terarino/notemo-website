# notemo.net

株式会社ノテモ コーポレートサイト。GitHub Pages で配信する静的サイト（HTML/CSS/Vanilla JS）。ビルドツール・npm 不使用、外部ライブラリは CDN のみ。

## 開発ルール

- 日本語で作業・コミットメッセージを書く
- 全ページに OGP・canonical・構造化データを設置
- 画像は WebP 形式、200KB 以下に最適化
- main ブランチへ push で GitHub Pages が自動デプロイ

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

## Git コミット prefix

| prefix | 用途 |
|---|---|
| `feat:` | 新機能・新ページ追加 |
| `fix:` | バグ修正・誤字修正 |
| `update:` | コンテンツ更新 |
| `style:` | デザイン・CSS 変更 |
| `seo:` | SEO 関連の変更 |
| `blog:` | ブログ記事の追加・更新 |
