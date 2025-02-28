'use client';

import { useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

let socket: Socket | null = null;

export default function MessagePage() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [dream, setDream] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!socket) {
      await fetch('/api/socket');
      socket = io('', {
        path: '/api/socket',
        addTrailingSlash: false
      });
    }

    const newMessage = {
      id: uuidv4(),
      name,
      message,
      dream,
      position: {
        x: Math.random() * (window.innerWidth - 300),
        y: Math.random() * (window.innerHeight - 200),
      },
      timestamp: Date.now(),
    };

    socket.emit('new-message', newMessage);
    setSubmitted(true);
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-6 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">感謝您的留言！</h2>
          <p className="text-gray-600">您的留言已經成功發送到留言牆上。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">留下您的祝福</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              您的大名
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              我想要對富揚說
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              我的夢幻引薦
            </label>
            <textarea
              value={dream}
              onChange={(e) => setDream(e.target.value)}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? '發送中...' : '發送留言'}
          </button>
        </div>
      </form>
    </div>
  );
} 