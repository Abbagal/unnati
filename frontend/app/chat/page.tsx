'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Scene3D from '@/components/Scene3D';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your AI career guidance assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      <div className="absolute top-20 left-0 w-1/4 h-1/4 opacity-5">
        <Scene3D />
      </div>
      
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold text-cyan-400 mb-8"
        >
          AI Career Assistant
        </motion.h1>

        <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-cyan-500/30 h-96 overflow-y-auto p-4 mb-4">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
            >
              <div className={`inline-block p-3 rounded-lg max-w-xs ${
                msg.role === 'user' 
                  ? 'bg-cyan-500/20 text-cyan-100' 
                  : 'bg-purple-500/20 text-purple-100'
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about your career path..."
            className="flex-1 px-4 py-3 bg-gray-800 border border-cyan-500/50 rounded-lg text-white focus:outline-none focus:border-cyan-400"
          />
          <button
            onClick={sendMessage}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white font-semibold transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}