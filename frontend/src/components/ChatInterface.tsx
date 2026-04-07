"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { Send, User, Bot, Loader2 } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/api/v1/qa', {
                question: input
            });

            const botMessage: Message = { role: 'assistant', content: response.data.answer };
            setMessages(prev => [...prev, botMessage]);
        } catch (err) {
            console.error(err);
            const errorMessage: Message = { role: 'assistant', content: "Sorry, I couldn't get an answer." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[500px] bg-white border rounded-lg shadow-sm">
            <div className="p-4 border-b bg-gray-50">
                <h3 className="font-semibold text-gray-700">Financial Advisor Chat</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 mt-10">
                        Ask questions about your financial documents...
                    </div>
                )}
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                            }`}>
                            <div className="flex items-center space-x-2 mb-1">
                                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                <span className="text-xs opacity-70 capitalize">{msg.role}</span>
                            </div>
                            <p className="text-sm cursor-text selection:bg-yellow-200 selection:text-black">{msg.content}</p>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg p-3 text-gray-800">
                            <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t bg-white">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask a question..."
                        className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
