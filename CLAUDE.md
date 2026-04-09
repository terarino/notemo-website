# CLAUDE.md - notemo.net プロジェクト指示書

## プロジェクト概要
- 株式会社ノテモ コーポレートサイト
- GitHub Pages 静的HTML/CSS/JSサイト
- ビルドツール・npm不使用。CDNのみ許可

## 開発ルール
- 日本語で作業・コミットメッセージを書く
- HTML/CSS/Vanilla JSのみ使用
- 外部ライブラリはCDN経由のみ（ローカルインストール禁止）
- 全ページにOGP・canonical・構造化データを設置する
- 画像はWebP形式、200KB以下に最適化

## ブランドカラー
- メイン（ダークグリーン）: #04342C
- アクセント（グリーン）: #1D9E75
- ライトグリーン: #E1F5EE
- テキスト（黒）: #111111
- テキスト（グレー）: #555555
- 背景（白）: #FFFFFF

## タイポグラフィ
- 日本語: Noto Sans JP（Google Fonts CDN）
- 英数字: Inter（Google Fonts CDN）
- H1: 32〜40px / font-weight: 700
- H2: 24〜28px / font-weight: 600
- 本文: 16px / line-height: 1.8

## ディレクトリ構成
```
notemo-website/
├── index.html
├── services.html
├── cases.html
├── company.html
├── blog/
│   ├── index.html
│   └── template.html
├── contact.html
├── css/
│   ├── style.css
│   └── components.css
├── js/
│   └── main.js
├── images/
├── CNAME
└── CLAUDE.md
```

## ブログ更新手順
1. `blog/template.html` を複製して `YYYY-MM-DD-slug.html` を作成
2. `blog/index.html` の記事リストに追加
3. `git add / commit / push`

## デプロイ
- mainブランチへpushで自動デプロイ（GitHub Pages）

## Gitコミット規則
- `feat:` 新機能・新ページ追加
- `fix:` バグ修正・誤字修正
- `update:` コンテンツ更新
- `style:` デザイン・CSSの変更
- `seo:` SEO関連の変更
- `blog:` ブログ記事の追加・更新
