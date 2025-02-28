import { Server } from 'socket.io';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Server as HTTPServer } from 'http';
import type { Socket as NetSocket } from 'net';
import type { Message } from '@/types/message';

interface SocketServer extends HTTPServer {
  io?: Server | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiRequest {
  socket: SocketWithIO;
}

const SocketHandler = (req: NextApiResponseWithSocket, res: NextApiResponse) => {
  if (req.socket.server.io) {
    console.log('Socket is already running');
    res.end();
    return;
  }

  console.log('Setting up socket');
  const io = new Server(req.socket.server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['*'],
      credentials: true,
    },
    transports: ['websocket', 'polling']
  });
  
  req.socket.server.io = io;

  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('new-message', (msg: Message) => {
      console.log('New message received:', msg);
      io.emit('message-received', msg);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  console.log('Socket is set up');
  res.end();
};

export default SocketHandler;

export const config = {
  api: {
    bodyParser: false,
  },
}; 