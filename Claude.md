# CLAUDE.md

このファイルは、このリポジトリでコードを操作する際のClaude Code (claude.ai/code) への指導を提供します。

## プロジェクトアーキテクチャ

これは、LLMチャット機能が統合されたReact TypeScript TODOアプリケーションです。アプリケーションは以下で構成されています：

### フロントエンド (React + TypeScript + Vite)
- **メインアプリ**: TODO管理とAIチャットインターフェースの2つのセクションに分割
- **状態管理**: チャット状態にはReact Context、TODO操作にはカスタムフックを使用
- **コンポーネント構造**: CSS モジュールでスタイリングされたモジュラーコンポーネント
- **API統合**: TODO用のAxiosベースAPIレイヤー、リアルタイムチャット用のSocket.IO

### バックエンドサービス
- **TODO JSON Server** (port 3001): TODO CRUD操作用のモックREST API
- **WebSocket通信サーバー** (port 3002): フロントエンドとMastraエージェント間のWebSocket通信
- **Mastra AIエージェント**: TypeScriptベースのAIエージェントフレームワークでTODO管理をサポート
- **LLM統合**: MastraのOllamaプロバイダーを通じてローカルOllamaインスタンスに接続 (デフォルト: gpt-oss:20bモデル)

### 主要なアーキテクチャコンポーネント
- `src/contexts/ChatContext.tsx`: reducerパターンによる集中化されたチャット状態管理
- `src/utils/socketSingleton.ts`: WebSocket接続用のシングルトンパターン
- `server/websocket.js`: WebSocket通信レイヤー（Mastraエージェントとの橋渡し）
- `server/agents/todoAgent.js`: MastraベースのTODO管理AIエージェント
- `src/api/todoApi.ts`: TODO操作用のREST APIクライアント
- `vite.config.ts`: `/api`をTODO JSON Serverにルーティングするプロキシ設定

## 開発コマンド

### 完全な開発環境の起動
```bash
npm run dev:all
```
これにより3つのサービスが同時に起動されます：
- React開発サーバー (port 5173)
- TODO JSON Server (port 3001)
- WebSocket通信サーバー + Mastraエージェント (port 3002)

### 個別サービス
```bash
npm run dev          # Reactフロントエンドのみ
npm run todoApi      # TODO JSON Serverのみ (TODO API)
npm run websocket    # WebSocket通信サーバー + Mastraエージェント (LLMチャット)
```

### ビルドと品質管理
```bash
npm run build        # TypeScriptコンパイル + Viteビルド
npm run typecheck    # TypeScript型チェック
npm run lint         # ESLint
npm run preview      # 本番ビルドのプレビュー
```

## LLM統合セットアップ

チャット機能は複数のLLMプロバイダーに対応しています。環境変数：
- `LLM_PROVIDER`: 使用するプロバイダー (デフォルト: ollama)
  - `ollama`: ローカルOllamaインスタンス
  - `openai`: OpenAI API
  - `anthropic`: Anthropic Claude API
  - `gemini`/`google`: Google Gemini API
- `LLM_MODEL`: 使用するモデル (デフォルト: gpt-oss:20b)
- `WS_PORT`: WebSocketサーバーポート (デフォルト: 3002)
- `DEBUG_CONNECTIONS`: 接続ログを有効化 (デフォルト: false)

### APIキー設定（クラウドプロバイダー使用時）
- `OPENAI_API_KEY`: OpenAI使用時に必要
- `ANTHROPIC_API_KEY`: Anthropic使用時に必要
- `GOOGLE_GENERATIVE_AI_API_KEY`: Gemini使用時に必要

**注意**: デフォルトのOllamaプロバイダーは自動的にローカルOllamaインスタンス（http://localhost:11434）に接続します。

## データフロー

1. **TODO操作**: フロントエンド → Viteプロキシ → TODO JSON Server → db.json
2. **チャットメッセージ**: フロントエンド → Socket.IO → WebSocketサーバー → Mastra TODOエージェント → LLMプロバイダー（Ollama/OpenAI/Anthropic/Gemini） → ストリーミングレスポンス
3. **チャットコンテキスト**: Mastra TODOエージェントは、コンテキスト対応レスポンスのためにシステムプロンプトに現在のTODOを含める（会話履歴は現在未実装）

## 状態管理パターン

- **TODO**: ローカル状態 + API同期によるカスタムフック (`useTodos`)
- **チャット**: 複雑な状態遷移のためのContext + Reducerパターン
- **WebSocket**: 複数接続を防ぐシングルトンパターン
- **ストリーミング**: Socket.IOイベントによるリアルタイムメッセージ更新

## ファイル構成

- `/src/components/`: CSS モジュールと併置されたReactコンポーネント
- `/src/contexts/`: React Contextプロバイダー
- `/src/hooks/`: カスタムReactフック
- `/src/api/`: APIクライアントモジュール
- `/src/types/`: TypeScript型定義
- `/server/`: Node.js WebSocketサーバーとMastraエージェント
  - `/server/websocket.js`: WebSocket通信サーバー
  - `/server/agents/todoAgent.js`: Mastra TODOエージェント

## Mastraアーキテクチャ

このプロジェクトは、Mastra.ai（TypeScriptベースのAIエージェントフレームワーク）を使用してAI機能を実装しています：

### Mastra統合の利点
- **型安全性**: TypeScriptネイティブでの開発
- **モジュラー設計**: エージェント機能とWebSocket通信の分離
- **拡張性**: RAG、ワークフロー、観測性などの高度な機能が利用可能
- **プロバイダー切り替え**: 異なるLLMプロバイダー間での簡単な切り替え
- **エラーハンドリング**: 統一されたエラー処理とストリーミング対応

### 主要パッケージ
- `@mastra/core`: Mastraフレームワークのコア機能
- `ollama-ai-provider`: OllamaとMastraの統合
- `@ai-sdk/openai`: OpenAI APIとの統合
- `@ai-sdk/anthropic`: Anthropic Claude APIとの統合
- `@ai-sdk/google`: Google Gemini APIとの統合