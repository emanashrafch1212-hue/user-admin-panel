import { useState } from 'react';

function AddUserForm({ onAddUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !course) {
      setMessage({ text: '⚠️ Please fill all fields.', type: 'message-error' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ text: '⚠️ Please enter a valid email.', type: 'message-error' });
      return;
    }

    // Wait for the backend response
    const result = await onAddUser(name, email, course);

    if (result === 'duplicate') {
      setMessage({ text: '⚠️ Email already exists.', type: 'message-error' });
      return;
    }

    if (result === 'error') {
      setMessage({ text: '⚠️ An error occurred. Please check the backend.', type: 'message-error' });
      return;
    }

    // If success, clear the form and show success message
    setName('');
    setEmail('');
    setCourse('');
    setMessage({ text: '✅ User added successfully!', type: 'message-success' });
    setTimeout(() => setMessage({ text: '', type: '' }), 2000);
  };

  return (
    <section className="glass-card p-6 md:p-8 mb-6 animate-slide-up delay-1">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-5 flex items-center gap-3">
        <span className="w-10 h-10 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <i className="fas fa-user-plus"></i>
        </span>
        Add New User
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="👤 Full Name"
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="flex-1">
          <input
            type="email"
            placeholder="✉️ Email Address"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex-1">
          <input
            type="text"
            placeholder="📚 Course"
            className="input-field"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-primary w-full md:w-auto">
          <i className="fas fa-plus mr-2"></i> Add User
        </button>
      </form>

      {message.text && (
        <p className={`mt-4 text-sm text-center font-medium ${message.type}`}>
          {message.text}
        </p>
      )}
    </section>
  );
}

export default AddUserForm;