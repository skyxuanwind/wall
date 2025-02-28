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
    res.end();
    return;
  }

  const io = new Server(req.socket.server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  
  req.socket.server.io = io;

  io.on('connection', (socket) => {
    socket.on('new-message', (msg: Message) => {
      io.emit('message-received', msg);
    });
  });

  res.end();
};

export default SocketHandler;

export const config = {
  api: {
    bodyParser: false,
  },
}; 