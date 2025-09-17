import { Agent } from '@mastra/core/agent';
import { getModelProvider } from './providers.ts';
import type { Todo, ProviderInfo } from '../types.js';

function createSystemPrompt(todos: Todo[]): string {
  return `あなたは親切なTODO管理アシスタントです。自然言語を使ってユーザーのタスク管理をサポートします。

現在のTODO:
${todos.map(todo => `- ${todo.id}: "${todo.title}" (${todo.completed ? '完了' : '未完了'}) - 作成日: ${todo.createdAt}`).join('\n')}

あなたができること:
1. タスクの分析と洞察の提供
2. タスクの優先順位付けの提案
3. タスクの進捗状況の説明
4. 効率的なタスク管理のアドバイス

常に親切で友好的な態度で回答してください。ユーザーがTODOの変更を求めた場合は、何が変更されたかを明確に確認してください。

ユーザーがTODOに対してアクションを実行したい場合は、実行可能な情報を提供し、TODOインターフェースの使用方法を提案してください。

すべての回答は日本語で行ってください。`;
}

class TodoAgent {
  private agent: Agent;
  public providerInfo: ProviderInfo;

  constructor() {
    try {
      // モデルプロバイダーを取得
      const model = getModelProvider();

      // プロバイダー情報をmodelオブジェクトから取得
      this.providerInfo = model.providerInfo;
      console.log(`Initializing TodoAgent with provider: ${this.providerInfo.provider}, model: ${this.providerInfo.model}`);

      console.log('@Model provider initialized:', model);

      this.agent = new Agent({
        name: 'TODOManagementAgent',
        instructions: 'あなたは親切なTODO管理アシスタントです。ユーザーのタスク管理をサポートし、分析や提案を行ってください。',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        model: model as any
      });
    } catch (error) {
      console.error('Failed to initialize TodoAgent:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  async generateResponse(userMessage: string, todos: Todo[]): Promise<string> {
    try {
      const systemPrompt = createSystemPrompt(todos);

      const result = await this.agent.generate([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]);

      return result.text;
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error(`エージェントの応答生成に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateStreamingResponse(
    userMessage: string,
    todos: Todo[],
    onChunk: (chunk: string, fullContent: string) => void
  ): Promise<string> {
    try {
      const systemPrompt = createSystemPrompt(todos);

      console.log('Generating streaming response for message:', userMessage);

      // V2モデル（Gemini等）の場合はstreamVNextを使用
      const useVNext = ['gemini', 'google', 'openai', 'anthropic'].includes(this.providerInfo.provider.toLowerCase());

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ];

      let fullContent = '';

      if (useVNext) {
        // V2モデル用のstreamVNextメソッドを使用
        console.log('Using streamVNext for V2 model:', this.providerInfo.model);
        const stream = await this.agent.streamVNext(messages);

        for await (const chunk of stream.textStream) {
          fullContent += chunk;
          onChunk(chunk, fullContent);
        }
      } else {
        // V1モデル用の従来のstreamメソッドを使用
        console.log('Using stream for V1 model:', this.providerInfo.model);
        const stream = await this.agent.stream(messages);

        for await (const chunk of stream.textStream) {
          fullContent += chunk;
          onChunk(chunk, fullContent);
        }
      }

      return fullContent;
    } catch (error) {
      console.error('Error generating streaming response:', error);
      throw new Error(`ストリーミング応答の生成に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export default TodoAgent;