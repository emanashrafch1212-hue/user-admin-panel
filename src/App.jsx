import { useState, useEffect } from 'react';
import Header from './components/Header';
import AddUserForm from './components/AddUserForm';
import SearchBar from './components/SearchBar';
import UserList from './components/UserList';
import StatusMessage from './components/StatusMessage';
import EditModal from './components/EditModal';

function App() {
  // ===== STATE =====
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [status, setStatus] = useState({ message: '', type: '' });
  const [darkMode, setDarkMode] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState('Checking...');

  // ===== LOCAL STORAGE =====
  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('users');
    if (saved) {
      setUsers(JSON.parse(saved));
      return true;
    }
    return false;
  };

  const saveToLocalStorage = (userList) => {
    localStorage.setItem('users', JSON.stringify(userList));
  };

  // ===== FILTER USERS =====
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

  // ===== COUNTERS =====
  const totalCount = users.length;
  const apiCount = users.filter(u => u.source === 'api').length;
  const localCount = users.filter(u => u.source !== 'api').length;

  // ===== CRUD OPERATIONS =====
  const addUser = (name, email, course) => {
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return 'duplicate';
    }
    const newUser = { id: Date.now(), name, email, course, source: 'local' };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveToLocalStorage(updatedUsers);
    return 'success';
  };

  const deleteUser = (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    const updatedUsers = users.filter(u => u.id !== id);
    setUsers(updatedUsers);
    saveToLocalStorage(updatedUsers);
  };

  const editUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const saveEdit = (id, name, email, course) => {
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== id)) {
      alert('Email already exists.');
      return;
    }
    const updatedUsers = users.map(u =>
      u.id === id ? { ...u, name, email, course } : u
    );
    setUsers(updatedUsers);
    saveToLocalStorage(updatedUsers);
  };

  // ===== FETCH API USERS =====
  const fetchApiUsers = async () => {
    try {
      setStatus({ message: 'Loading users...', type: 'loading' });
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) throw new Error('Failed to fetch');
      const apiUsers = await response.json();
      const mapped = apiUsers.map(u => ({
        id: 'api_' + u.id,
        name: u.name,
        email: u.email,
        course: 'MERN',
        source: 'api'
      }));
      if (!users.some(u => u.source === 'api')) {
        const updatedUsers = [...users, ...mapped];
        setUsers(updatedUsers);
        saveToLocalStorage(updatedUsers);
      }
      setStatus({ message: '', type: '' });
    } catch (error) {
      console.error(error);
      setStatus({ message: 'Unable to load users.', type: 'error' });
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

  // ===== DARK MODE =====
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode ? 'true' : 'false');
  };

  // ===== USE EFFECTS =====
  useEffect(() => {
    if (localStorage.getItem('darkMode') === 'true') setDarkMode(true);
    loadFromLocalStorage();
    fetchApiUsers();
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

  // ===== RENDER =====
  return (
    <div className="gradient-bg transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <Header
          userCount={totalCount}
          apiCount={apiCount}
          localCount={localCount}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />

        {/* ===== BACKEND STATUS ===== */}
        <div className="glass-card p-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🖥️</span>
            <div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Backend Status</div>
              <div className="text-sm font-semibold text-gray-800 dark:text-white">{backendStatus}</div>
            </div>
          </div>
        </div>

        {/* ===== BACKEND API TEST ===== */}
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
        
        <section className="glass-card p-6 md:p-8">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <i className="fas fa-users"></i>
              </span>
              Users
              <span className="text-sm font-normal text-gray-400 dark:text-gray-500">— Manage all users</span>
            </h2>
          </div>
          <UserList users={filteredUsers} onEdit={editUser} onDelete={deleteUser} />
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