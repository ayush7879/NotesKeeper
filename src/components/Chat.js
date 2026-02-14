import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import UserList from './UserList';

const Chat = (props) => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionErrorShown, setConnectionErrorShown] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch current user info
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/getuser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token
          }
        });
        const user = await response.json();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
        props.showalert('Failed to load user data', 'danger');
      }
    };

    fetchCurrentUser();

    // Initialize Socket.io connection
    const newSocket = io('http://localhost:5000', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('✅ User connected to chat server');
      setIsConnected(true);
      setConnectionErrorShown(false); // Reset error flag on successful connection
      // props.showalert('User connected to chat server', 'success');
    });

    newSocket.on('disconnect', () => {
      console.log('❌ User disconnected from chat server');
      setIsConnected(false);
      // props.showalert('Disconnected from chat server', 'warning');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
      // Only show error once to prevent spam
      if (!connectionErrorShown) {
        setConnectionErrorShown(true);
        props.showalert('Failed to connect to chat server. Please make sure the backend is running on port 5000.', 'danger');
      }
    });

    newSocket.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('file', (fileData) => {
      setMessages(prev => [...prev, fileData]);
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
      props.showalert(error.message || 'Connection error', 'danger');
    });

    setSocket(newSocket);

    return () => {
      setIsConnected(false);
      newSocket.close();
    };
  }, [navigate, props]);

  useEffect(() => {
    // Load chat history when a user is selected
    if (selectedUser && currentUser) {
      loadChatHistory();
    }
  }, [selectedUser, currentUser]);

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/chat/history/${selectedUser._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        }
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !file) return;
    if (!selectedUser || !socket) return;

    try {
      if (file) {
        // Handle file upload
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('receiverId', selectedUser._id);

        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/chat/upload', {
          method: 'POST',
          headers: {
            'auth-token': token
          },
          body: formData
        });

        const data = await response.json();
        if (data.success) {
          socket.emit('file', {
            senderId: currentUser._id,
            receiverId: selectedUser._id,
            fileName: data.fileName,
            fileUrl: data.fileUrl,
            fileType: data.fileType,
            timestamp: new Date()
          });
          setFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
        setUploading(false);
      }

      if (newMessage.trim()) {
        // Send text message
        const messageData = {
          senderId: currentUser._id,
          receiverId: selectedUser._id,
          message: newMessage,
          timestamp: new Date()
        };

        socket.emit('message', messageData);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      props.showalert('Failed to send message', 'danger');
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        props.showalert('File size should be less than 10MB', 'danger');
        return;
      }
      setFile(selectedFile);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!currentUser) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#000000', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#000000', 
      padding: '40px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Main Chat Card */}
      <div style={{
        width: '85%',
        maxWidth: '1200px',
        height: '85vh',
        backgroundColor: '#E3F2FD',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        overflow: 'hidden'
      }}>
        {/* Left Sidebar - User List */}
        <div style={{
          width: '35%',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E0E0E0',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Sidebar Header */}
          <div style={{
            backgroundColor: '#075E54',
            padding: '15px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'white'
          }}>
            <div>
              <h5 style={{ margin: 0, fontSize: '18px', fontWeight: '500' }}>
                {currentUser.name}
              </h5>
              <small style={{ opacity: 0.8, fontSize: '12px' }}>
                {isConnected ? '● Online' : '○ Offline'}
              </small>
            </div>
            <button
              className="btn btn-sm"
              onClick={() => navigate('/')}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                borderRadius: '5px',
                padding: '5px 15px'
              }}
            >
              Back
            </button>
          </div>

          {/* User List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <UserList 
              onUserSelect={setSelectedUser} 
              selectedUser={selectedUser}
              currentUserId={currentUser}
            />
          </div>
        </div>

        {/* Right Side - Chat Area */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#E3F2FD'
        }}>
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div style={{
                backgroundColor: '#075E54',
                padding: '12px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: 'white',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#25D366',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '18px'
                  }}>
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h6 style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>
                      {selectedUser.name}
                    </h6>
                    <small style={{ opacity: 0.8, fontSize: '12px' }}>
                      {isConnected ? 'online' : 'offline'}
                    </small>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div 
                style={{ 
                  flex: 1,
                  padding: '20px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                {messages.length === 0 ? (
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999',
                    fontSize: '14px'
                  }}>
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const senderId = msg.senderId?._id || msg.senderId || msg.sender;
                    const isOwnMessage = senderId === currentUser._id || senderId === currentUser.id;
                    return (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                          marginBottom: '5px'
                        }}
                      >
                        <div
                          style={{
                            maxWidth: '65%',
                            padding: '8px 12px',
                            borderRadius: isOwnMessage ? '7.5px 0 7.5px 7.5px' : '0 7.5px 7.5px 7.5px',
                            backgroundColor: isOwnMessage ? '#DCF8C6' : '#FFFFFF',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                            wordWrap: 'break-word'
                          }}
                        >
                          {msg.fileUrl ? (
                            <div>
                              <div style={{ marginBottom: '5px', fontWeight: '500' }}>
                                <i className="bi bi-file-earmark me-2"></i>
                                {msg.fileName || 'File'}
                              </div>
                              <a
                                href={`http://localhost:5000${msg.fileUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: '#075E54',
                                  textDecoration: 'underline',
                                  fontSize: '13px'
                                }}
                              >
                                Download File
                              </a>
                            </div>
                          ) : (
                            <div style={{ marginBottom: '3px', fontSize: '14px', lineHeight: '1.4' }}>
                              {msg.message || msg.text || ''}
                            </div>
                          )}
                          <div style={{
                            fontSize: '11px',
                            color: '#999',
                            textAlign: 'right',
                            marginTop: '3px'
                          }}>
                            {formatTime(msg.timestamp)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* File Preview */}
              {file && (
                <div style={{
                  padding: '10px 20px',
                  backgroundColor: '#F0F0F0',
                  borderTop: '1px solid #E0E0E0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <small style={{ fontSize: '12px' }}>
                    Selected: <strong>{file.name}</strong>
                  </small>
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '2px 10px',
                      fontSize: '12px'
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Message Input */}
              <form onSubmit={handleSendMessage} style={{
                padding: '10px 20px',
                backgroundColor: '#F0F0F0',
                borderTop: '1px solid #E0E0E0',
                display: 'flex',
                gap: '10px',
                alignItems: 'center'
              }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  style={{
                    display: 'none'
                  }}
                  accept="*/*"
                  id="file-input"
                />
                <label
                  htmlFor="file-input"
                  style={{
                    padding: '8px 15px',
                    backgroundColor: '#075E54',
                    color: 'white',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    border: 'none'
                  }}
                >
                  <i className="bi bi-paperclip"></i>
                </label>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={uploading}
                  style={{
                    flex: 1,
                    padding: '10px 15px',
                    borderRadius: '25px',
                    border: 'none',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={uploading || (!newMessage.trim() && !file)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: uploading || (!newMessage.trim() && !file) ? '#ccc' : '#25D366',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50px',
                    cursor: uploading || (!newMessage.trim() && !file) ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '45px',
                    height: '45px'
                  }}
                >
                  {uploading ? (
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                  ) : (
                    <i className="bi bi-send-fill"></i>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999'
            }}>
              <i className="bi bi-chat-dots" style={{ fontSize: '5rem', marginBottom: '20px', opacity: 0.3 }}></i>
              <h5 style={{ color: '#666', fontWeight: '400' }}>Select a user to start chatting</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
