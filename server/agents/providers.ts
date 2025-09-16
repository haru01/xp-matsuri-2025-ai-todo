import { ollama } from 'ollama-ai-provider';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import type { ModelWithProviderInfo } from '../types.js';

/**
 * LLMプロバイダーとモデルを環境変数に基づいて取得
 * @returns {ModelWithProviderInfo} モデルとプロバイダー情報を含むオブジェクト
 */
export function getModelProvider(): ModelWithProviderInfo {
  const provider = process.env.LLM_PROVIDER || 'ollama';
  const modelName = process.env.LLM_MODEL || 'gpt-oss:20b';

  console.log(`＠Initializing LLM provider: ${provider} with model: ${modelName}`);

  let model: any;
  switch (provider.toLowerCase()) {
    case 'ollama':
      // Ollamaプロバイダー（ローカルLLM）
      model = ollama(modelName);
      break;

    case 'openai':
      // OpenAI APIキーの確認
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY environment variable is required for OpenAI provider');
      }
      // OpenAIプロバイダー
      // モデル例: gpt-5, gpt-4.5-turbo, o2-preview, o1
      model = openai(modelName);
      break;

    case 'anthropic':
      // Anthropic APIキーの確認
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY environment variable is required for Anthropic provider');
      }
      // Anthropicプロバイダー（Claude）
      // モデル例: claude-4-opus, claude-4-sonnet, claude-3.5-sonnet-latest
      model = anthropic(modelName);
      break;

    case 'gemini':
    case 'google':
      // Google APIキーの確認
      if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        throw new Error('GOOGLE_GENERATIVE_AI_API_KEY environment variable is required for Google provider');
      }
      // Googleプロバイダー（Gemini）
      // モデル例: gemini-2.5-pro, gemini-2.5-flash, gemini-1.5-pro, gemini-1.5-flash
      // streamVNextメソッドを使用してV2モデルのストリーミングに対応
      model = google(modelName);
      break;

    default:
      throw new Error(`Unsupported LLM provider: ${provider}. Supported providers: ollama, openai, anthropic, gemini`);
  }

  // モデルオブジェクトにプロバイダー情報を追加
  model.providerInfo = {
    provider: provider,
    model: modelName
  };

  return model as ModelWithProviderInfo;
}