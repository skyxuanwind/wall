'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';
import type { Message } from '@/types/message';

let socket: any;

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [opacity, setOpacity] = useState(0.3);

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch('/api/socket');
      socket = io();

      socket.on('message-received', (msg: Message) => {
        setMessages((prev) => [...prev, msg]);
      });
    };

    socketInitializer();

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const progress = Math.min(messages.length / 20, 1);
    setOpacity(0.3 + (0.7 * progress));
  }, [messages]);

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
      <div 
        className="absolute inset-0 flex items-center justify-center text-white text-6xl font-bold text-center transition-opacity duration-1000"
        style={{ opacity }}
      >
        BNI富揚白金名人堂分會留言牆
      </div>

      {messages.length >= 20 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-4xl font-bold z-50"
        >
          歡迎進入富揚第七屆
        </motion.div>
      )}

      {messages.map((msg) => (
        <motion.div
          key={msg.id}
          className="absolute bg-white/90 rounded-xl p-4 shadow-lg w-64"
          initial={{ x: msg.position.x, y: msg.position.y, opacity: 0 }}
          animate={{
            x: [msg.position.x, msg.position.x + Math.random() * 100 - 50],
            y: [msg.position.y, msg.position.y + Math.random() * 100 - 50],
            opacity: 1,
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <h3 className="font-bold text-lg">{msg.name}</h3>
          <p className="text-sm mt-2">我想要對富揚說：{msg.message}</p>
          <p className="text-sm mt-2">我的夢幻引薦：{msg.dream}</p>
        </motion.div>
      ))}
    </main>
  );
} 