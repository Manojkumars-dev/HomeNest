import React, { useState, useEffect, useRef } from 'react';
import { Send, UserCircle2 } from 'lucide-react';
import api from '../../api/api';

export default function OwnerMessages() {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/messages/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const response = await api.get(`/messages/${userId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedUser) return;

    try {
      const response = await api.post('/messages', {
        receiverId: selectedUser.id,
        content: inputText
      });
      setMessages([...messages, response.data]);
      setInputText('');
      fetchConversations();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 140px)', backgroundColor: 'var(--color-background)', borderTop: '1px solid var(--color-bebe)' }}>
      {/* Left Panel - Conversations */}
      <div style={{ width: '300px', backgroundColor: 'var(--color-white)', borderRight: '1px solid var(--color-bebe)', overflowY: 'auto' }}>
        <h2 style={{ padding: '20px', margin: 0, fontFamily: 'var(--font-headline)', borderBottom: '1px solid var(--color-bebe)' }}>Messages</h2>
        {conversations.length === 0 ? (
          <div style={{ padding: '20px', color: 'var(--color-foggy)', textAlign: 'center', lineHeight: '1.5' }}>
            No messages yet — tenants will contact you about your properties!
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {conversations.map(conv => (
              <li 
                key={conv.otherUser.id}
                onClick={() => setSelectedUser(conv.otherUser)}
                style={{ 
                  padding: '16px 20px', 
                  borderBottom: '1px solid var(--color-bebe)',
                  cursor: 'pointer',
                  borderLeft: selectedUser?.id === conv.otherUser.id ? '4px solid var(--color-primary)' : '4px solid transparent',
                  backgroundColor: selectedUser?.id === conv.otherUser.id ? '#fdf2f5' : 'transparent',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <UserCircle2 size={36} color="var(--color-foggy)" />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold' }}>{conv.otherUser.name}</span>
                      {conv.unreadCount > 0 && (
                        <span style={{ backgroundColor: 'var(--color-primary)', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '10px' }}>
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--color-foggy)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {conv.lastMessage?.content}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right Panel - Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-background)' }}>
        {!selectedUser ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-foggy)' }}>
            Select a conversation to start chatting
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div style={{ padding: '20px', backgroundColor: 'var(--color-white)', borderBottom: '1px solid var(--color-bebe)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <UserCircle2 size={32} color="var(--color-foggy)" />
              <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{selectedUser.name}</span>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {messages.map((msg, i) => {
                const isSent = msg.senderId !== selectedUser.id;
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: isSent ? 'flex-end' : 'flex-start' }}>
                    <div style={{ 
                      maxWidth: '70%', 
                      padding: '12px 16px', 
                      borderRadius: '16px', 
                      backgroundColor: isSent ? 'var(--color-primary)' : '#f0f0f0',
                      color: isSent ? 'white' : 'var(--color-on-surface)',
                      borderBottomRightRadius: isSent ? '4px' : '16px',
                      borderBottomLeftRadius: !isSent ? '4px' : '16px',
                    }}>
                      <div style={{ wordBreak: 'break-word', lineHeight: '1.4' }}>{msg.content}</div>
                      <div style={{ fontSize: '10px', marginTop: '6px', textAlign: 'right', opacity: 0.8 }}>
                        {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} style={{ padding: '16px', backgroundColor: 'var(--color-white)', borderTop: '1px solid var(--color-bebe)', display: 'flex', gap: '12px' }}>
              <input 
                type="text" 
                className="input" 
                placeholder="Type your message..." 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn-primary" disabled={!inputText.trim()} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Send size={18} /> Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
