import { useState, useEffect } from 'react';
import Header from './components/Header';
import AddUserForm from './components/AddUserForm';
import SearchBar from './components/SearchBar';
import UserList from './components/UserList';
import StatusMessage from './components/StatusMessage';
import EditModal from './components/EditModal';

function App() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [status, setStatus] = useState({ message: '', type: '' });
  const [darkMode, setDarkMode] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState('Checking...');

  const getFilteredUsers = () => {
    let filtered = [...users];
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (currentFilter !== 'all') {
      filtered = filtered.filter(u =>
        u.course?.toLowerCase() === currentFilter.toLowerCase()
      );
    }
    return filtered;
  };

  const totalCount = users.length;
  const apiCount = users.filter(u => u.source === 'api').length;

  // ===== Load users and Check Connection ONLY ONCE =====
  useEffect(() => {
    setStatus({ message: '⏳ Loading users...', type: 'loading' });
    setBackendStatus('Checking...');

    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users', {
          cache: 'no-store'
        });
        if (!response.ok) throw new Error('Failed to fetch');
        
        const backendUsers = await response.json();
        const mappedUsers = backendUsers.map(u => ({ ...u, source: 'api' }));
        
        setUsers(mappedUsers);
        setBackendStatus('✅ Backend Connected');
        setStatus({ message: '✅ Backend Connected. Users loaded.', type: 'success' });
        
        // Hide the message after 3 seconds
        setTimeout(() => {
          setStatus({ message: '', type: '' });
        }, 3000);
        
      } catch (error) {
        console.error('Error fetching backend users:', error);
        
        setUsers([]);
        setStatus({ message: '❌ Backend Offline. Please start the server.', type: 'error' });
        setBackendStatus('❌ Backend Offline');
      }
    };

    checkBackend(); // ONLY check when page loads
  }, []);

  // ===== UPDATED: Add user (POST) =====
  const addUser = async (name, email, course) => {
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return 'duplicate';
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, course })
      });
      
      if (response.status === 201) {
        const newUser = await response.json();
        const updatedUsers = [...users, { ...newUser, source: 'api' }];
        setUsers(updatedUsers);
        return 'success';
      } else {
        // READ THE ERROR MESSAGE FROM THE BACKEND
        const errorData = await response.json();
        alert('Error: ' + errorData.message);
        return 'error';
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Cannot reach backend server. Please run your backend.');
      return 'error';
    }
  };

  // ===== UPDATED: Delete user (DELETE) =====
  const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        const updatedUsers = users.filter(u => u.id !== id);
        setUsers(updatedUsers);
      } else {
        const errorData = await response.json();
        alert('Error: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Cannot reach backend server. Please run your backend.');
    }
  };

  const editUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  // ===== UPDATED: Save Edit (PUT) =====
  const saveEdit = async (id, name, email, course) => {
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== id)) {
      alert('Email already exists.');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, course })
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        const updatedUsers = users.map(u =>
          u.id === id ? { ...updatedUser, source: 'api' } : u
        );
        setUsers(updatedUsers);
        setIsModalOpen(false);
        setEditingUser(null);
      } else {
        const errorData = await response.json();
        alert('Error: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Cannot reach backend server. Please run your backend.');
    }
  };

  // ===== BACKEND FUNCTIONS =====
  const checkBackendStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/status');
      if (response.ok) {
        setBackendStatus('✅ Backend Connected');
      } else {
        setBackendStatus('⚠️ Backend Error');
      }
    } catch (error) {
      setBackendStatus('❌ Backend Offline');
    }
  };

  const testApi = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      const data = await response.json();
      alert('API Response: ' + JSON.stringify(data, null, 2));
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode ? 'true' : 'false');
  };

  // Only load dark mode setting, no fake API calls
  useEffect(() => {
    if (localStorage.getItem('darkMode') === 'true') setDarkMode(true);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const filteredUsers = getFilteredUsers();

  return (
    <div className="gradient-bg transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <Header
          userCount={totalCount}
          apiCount={apiCount}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />

        {/* BACKEND STATUS */}
        <div className="glass-card p-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🖥️</span>
            <div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Backend Status</div>
              <div className="text-sm font-semibold text-gray-800 dark:text-white">{backendStatus}</div>
            </div>
          </div>
        </div>

        {/* BACKEND API TEST */}
        <div className="glass-card p-4 mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">🌐 Backend API Test</h3>
          <button onClick={testApi} className="btn-primary">Test /api/users</button>
        </div>

        <AddUserForm onAddUser={addUser} />
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
        />
        <StatusMessage message={status.message} type={status.type} />
        <section className="glass-card p-6 md:p-8 animate-slide-up delay-3">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <i className="fas fa-users"></i>
              </span>
              Users
              <span className="text-sm font-normal text-gray-400 dark:text-gray-500">
                — Manage all users
              </span>
            </h2>
          </div>
          <UserList
            users={filteredUsers}
            onEdit={editUser}
            onDelete={deleteUser}
          />
        </section>
        <EditModal
          isOpen={isModalOpen}
          user={editingUser}
          onClose={() => {
            setIsModalOpen(false);
            setEditingUser(null);
          }}
          onSave={saveEdit}
        />
      </div>
    </div>
  );
}

export default App;