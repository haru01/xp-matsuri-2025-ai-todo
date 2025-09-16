import 'dotenv/config';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import TodoAgent from './agents/todoAgent.ts';
import type { ChatMessage, ChatResponse, ChatError } from './types.js';

const server = createServer();
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"]
  }
});

const DEBUG_CONNECTIONS = process.env.DEBUG_CONNECTIONS === 'true';
const todoAgent = new TodoAgent();

io.on('connection', (socket: Socket) => {
  if (DEBUG_CONNECTIONS) {
    console.log('Client connected:', socket.id);
  }

  socket.on('chat_message', async (data: ChatMessage) => {
    const { message, context } = data;
    const messageId = Math.random().toString(36).slice(2);

    try {
      console.log('Received chat message:', message);
      console.log('Received chat context:', context);

      socket.emit('chat_response_start');

      const fullResponse = await todoAgent.generateStreamingResponse(
        message,
        context.todos || [],
        (chunk: string, fullContent: string) => {
          socket.emit('chat_response_chunk', {
            id: messageId,
            content: fullContent,
            chunk: chunk
          } satisfies ChatResponse);
        }
      );

      socket.emit('chat_response_end', {
        id: messageId,
        content: fullResponse
      } satisfies ChatResponse);

    } catch (error) {
      console.error('Chat error:', error);
      socket.emit('chat_error', {
        message: error instanceof Error ? error.message : 'エージェントとの通信でエラーが発生しました'
      } satisfies ChatError);
    }
  });

  socket.on('disconnect', () => {
    if (DEBUG_CONNECTIONS) {
      console.log('Client disconnected:', socket.id);
    }
  });
});

const PORT = process.env.WS_PORT || 3002;

server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
  console.log('Mastra TODO Agent initialized');
  console.log(`LLM Model: ${process.env.LLM_MODEL || 'gpt-oss:20b'}`);
});

export default server;