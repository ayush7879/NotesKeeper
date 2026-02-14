import React, { useState, useEffect } from 'react';

const UserList = ({ onUserSelect, selectedUser, currentUserId }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        setLoading(false);
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/chat/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        }
      });
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        if (retryCount === 0) {
          setError('Backend server is not running. Please start it with: cd backend && npm start');
        } else {
          setError('Server returned an error. Please check if backend is running.');
        }
        setLoading(false);
        return;
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        setError(errorData.error || 'Failed to load users');
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      console.log('Users fetched:', data); // Debug log
      
      if (data.success && data.users && Array.isArray(data.users)) {
        // Filter out current user if currentUserId is provided
        let filteredUsers = data.users;
        if (currentUserId) {
          const currentId = currentUserId._id || currentUserId.id || currentUserId;
          filteredUsers = data.users.filter(user => {
            const userId = user._id || user.id;
            if (!userId) return false;
            return userId.toString() !== currentId.toString();
          });
        }
        console.log(`Displaying ${filteredUsers.length} users (filtered from ${data.users.length} total)`);
        setUsers(filteredUsers);
        setError(null);
      } else {
        console.error('Invalid response format:', data);
        setError('Failed to load users. Invalid response format.');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        if (retryCount === 0) {
          setError('Cannot connect to backend server. Please start it with: cd backend && npm start');
          setRetryCount(1);
        } else {
          setError('Backend server is not running. Start it and click Retry.');
        }
      } else {
        setError('Failed to load users. Please try again.');
      }
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
      }}>
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <small style={{ marginTop: '15px', color: '#999' }}>Loading users...</small>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: 'white',
        textAlign: 'center'
      }}>
        <div style={{ color: '#dc3545', marginBottom: '15px', fontSize: '14px' }}>
          {error}
        </div>
        <button 
          className="btn btn-sm"
          onClick={() => {
            setRetryCount(0);
            setLoading(true);
            fetchUsers();
          }}
          style={{
            backgroundColor: '#25D366',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            padding: '8px 20px',
            fontSize: '13px'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Search Bar */}
      <div style={{ padding: '10px', backgroundColor: '#F0F2F5', borderBottom: '1px solid #E0E0E0' }}>
        <input
          type="text"
          placeholder="Search or start new chat"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 15px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: 'white',
            fontSize: '14px',
            outline: 'none'
          }}
        />
      </div>

      {/* User List */}
      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: 'white' }}>
        {filteredUsers.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: '#999',
            padding: '40px 20px',
            fontSize: '14px'
          }}>
            {searchTerm ? 'No users found' : 'No users available'}
          </div>
        ) : (
          filteredUsers.map((user) => {
            const isSelected = selectedUser && selectedUser._id === user._id;
            return (
              <div
                key={user._id}
                onClick={() => onUserSelect(user)}
                style={{
                  padding: '12px 15px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#E5E5E5' : 'white',
                  borderBottom: '1px solid #F0F0F0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'background-color 0.2s',
                  ':hover': {
                    backgroundColor: '#F5F5F5'
                  }
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = '#F5F5F5';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: '#25D366',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '20px',
                    flexShrink: 0
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: '500',
                    fontSize: '16px',
                    color: '#000',
                    marginBottom: '3px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {user.name}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#999',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {user.email}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UserList;
