import React, { useState } from 'react';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

const DoctorMessages = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'Patient John', content: 'Hello Doctor, I have a question.', timestamp: '2024-04-30 10:00 AM' },
    { id: '2', sender: 'Doctor', content: 'Please go ahead.', timestamp: '2024-04-30 10:05 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim() === '') return;
    const message: Message = {
      id: (messages.length + 1).toString(),
      sender: 'Doctor',
      content: newMessage,
      timestamp: new Date().toLocaleString(),
    };
    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen p-6 bg-background flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      <div className="flex-1 overflow-auto border rounded p-4 mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`mb-3 ${msg.sender === 'Doctor' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block px-4 py-2 rounded ${msg.sender === 'Doctor' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              <p>{msg.content}</p>
              <span className="text-xs block mt-1">{msg.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default DoctorMessages;
