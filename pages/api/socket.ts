import { Server } from 'socket.io';
import type { NextApiRequest } from 'next';
import type { Server as HTTPServer } from 'http';
import type { Socket as NetSocket } from 'net';

interface SocketServer extends HTTPServer {
  io?: Server | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiRequest {
  socket: SocketWithIO;
}

const SocketHandler = (req: NextApiResponseWithSocket, res: any) => {
  if (req.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(req.socket.server);
  req.socket.server.io = io;

  io.on('connection', (socket) => {
    socket.on('new-message', (msg) => {
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