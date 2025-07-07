import { io, Socket } from 'socket.io-client';

export let socket: Socket;

class SocketService {
  setupSocketConnection() {
    socket = io('http://localhost:3000', {
      transports: ['websocket'],
      secure: false // Set to true if using HTTPS
    });
    this.socketConnectionEvents();
  }

  socketConnectionEvents() {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', (reason: Socket.DisconnectReason) => {
      console.log(`Reason: ${reason}`);
      socket.connect();
    });

    socket.on('connect_error', (error: Error) => {
      console.log(`${error}`);
      socket.connect();
    });
  }
}

export const socketService = new SocketService();
