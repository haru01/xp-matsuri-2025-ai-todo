import { io, Socket } from 'socket.io-client';

class SocketSingleton {
  private socket: Socket | null = null;
  private connecting = false;

  getInstance(url: string): Socket {
    if (this.socket && !this.socket.disconnected) {
      return this.socket;
    }

    if (this.connecting) {
      // If already connecting, return a placeholder that will be replaced
      return this.socket!;
    }

    this.connecting = true;

    this.socket = io(url, {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      this.connecting = false;
    });

    this.socket.on('disconnect', () => {
      this.connecting = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connecting = false;
    }
  }
}

export const socketSingleton = new SocketSingleton();