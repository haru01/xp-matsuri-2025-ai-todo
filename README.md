# XP Matsuri TODO

LLMチャット機能が統合されたReact TypeScript TODOアプリケーション

## 🌟 特徴

- **TODO管理**: 直感的なタスク管理インターフェース
- **AIチャット**: 複数のLLMプロバイダーに対応したAIアシスタント
- **リアルタイム通信**: WebSocketによるストリーミングレスポンス
- **マルチプロバイダー**: Ollama、OpenAI、Anthropic、Geminiをサポート
- **モダンスタック**: React + TypeScript + Vite + Mastra.ai

## 🏗️ アーキテクチャ

### フロントエンド
- **React + TypeScript + Vite**: モダンな開発環境
- **CSS Modules**: スタイリング
- **Socket.IO**: リアルタイム通信
- **Context + Reducer**: 状態管理

### バックエンド
- **TODO JSON Server** (port 3001): REST API
- **WebSocket Server** (port 3002): リアルタイム通信
- **Mastra AI Agent**: LLM統合とストリーミング

## 🚀 クイックスタート

### 前提条件

- Node.js 18+
- npm または yarn

### 1. インストール

```bash
git clone <repository-url>
cd xp-matsuri-todo
npm install
```

### 2. 環境設定

デフォルトではOllamaを使用します（追加設定不要）：

```bash
# Ollamaをインストール（macOS）
brew install ollama

# モデルをダウンロード
ollama pull gpt-oss:20b
```

### 3. 開発サーバー起動

```bash
# 全サービスを同時起動
npm run dev:all
```

アプリケーションが以下のURLで利用可能になります：
- **フロントエンド**: http://localhost:5173
- **TODO API**: http://localhost:3001
- **WebSocket**: http://localhost:3002

## ⚙️ 環境変数

### 基本設定

```bash
# プロバイダー選択 (ollama, openai, anthropic, gemini)
LLM_PROVIDER=ollama

# モデル名
LLM_MODEL=gpt-oss:20b

# ポート設定
WS_PORT=3002

# デバッグ
DEBUG_CONNECTIONS=false
```

### クラウドプロバイダー設定

```bash

# Google Gemini
LLM_PROVIDER=gemini
LLM_MODEL=gemini-2.5-pro
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key
```

## 📦 スクリプト

### 開発

```bash
npm run dev:all      # 全サービス起動
npm run dev          # フロントエンドのみ
npm run todoApi      # TODO APIのみ
npm run websocket    # WebSocketサーバーのみ
```

### ビルド

```bash
npm run build        # 本番ビルド
npm run preview      # ビルド結果プレビュー
npm run typecheck    # TypeScript型チェック
npm run lint         # ESLint
```

## 🛠️ プロジェクト構造

```
├── src/                    # フロントエンドソース
│   ├── components/         # Reactコンポーネント
│   ├── contexts/          # Context providers
│   ├── hooks/             # カスタムフック
│   ├── api/               # APIクライアント
│   └── types/             # TypeScript型定義
├── server/                # バックエンドサーバー
│   ├── websocket.js       # WebSocket通信サーバー
│   └── agents/            # Mastra AIエージェント
│       ├── todoAgent.js   # TODOエージェント
│       └── providers.js   # LLMプロバイダー設定
├── db.json               # TODO データ（JSON Server）
└── vite.config.ts        # Vite設定
```

## 🔧 技術スタック

### フロントエンド
- React 18
- TypeScript
- Vite
- CSS Modules
- Socket.IO Client
- Axios

### バックエンド
- Node.js
- Socket.IO
- JSON Server
- Mastra.ai

### AI/LLM
- Ollama (ローカル)
- OpenAI GPT
- Anthropic Claude
- Google Gemini

## 📱 使い方

1. **TODO管理**: 左側でタスクの追加・編集・削除
2. **AIチャット**: 右側でAIアシスタントと対話
3. **コンテキスト**: AIは現在のTODOリストを把握してアドバイス
4. **ストリーミング**: AIレスポンスはリアルタイムで表示



## レビュー
スプリントレビューの目的は、インクリメントがプロダクトゴールにどの程度近づいているかを評価し、次のステップを計画することです。

1. 完了したユーザーストーリーのデモ
2. ざっくばらんに意見交換＆フィードバックの収集
3. プロダクトバックログの見直しと優先順位付け

- 次のスプリントに向けた改善点

## ふりかえり（初回はスキップ）

今日はAIをつかったLLMアプリ作りで感想や気づいたことを共有しましょう。

## 開発

HRT原則で、わいわい楽しく開発しましょう。


## 目指したい方向性

ゴールや制約、タスク分解、優先順位、進捗、わからない知識習得、困りごと相談をAIに相談や周囲にエスカレーションなど、過去のタスクのふりかえり支援を繰り返すことで、だんだんと仕事すること熟達していくことを支援する,
「AIコンシェルジュ付きTODOアプリ」を作りたい！


## TODO.md



* AIにTODO要素について相談したい。TODO要素ドラックアンドドロップでAIアシスタント側にすると、メッセージテキスト内容を反映し,AIに相談したい。
* AIにタスクの優先順位について相談し、提案してもらい、TODOリストの順番を入れ回たい
* ゴールや制約の入力枠をつくり、その情報を元にTODOリストをAIに提案してもらい反映したい
* 上司に進捗状況＋困りごとを報告するメール文書をAIに作成してもらいたい。
* AIチャット入力後の出力にバグがある。なぜかAIからの回答が２つの欄が出てくる
* AIチャットの出力が長くなるとスクロールでTODOリストが見えなくなる


## DONE

* タスク管理優先順位の入れ替えができるようにしたい。
* AIチャット初期のTODO要素は認識しますが、後からTODOアプリ側で追加した要素追加したをAIチャット側では認識しない

## 🤝 貢献

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🙏 謝辞

- [Mastra.ai](https://mastra.ai) - AIエージェントフレームワーク
- [Ollama](https://ollama.ai) - ローカルLLM実行環境
- React、TypeScript、Viteコミュニティ
