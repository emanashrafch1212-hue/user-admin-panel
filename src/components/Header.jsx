function Header({ userCount, apiCount, darkMode, toggleDarkMode }) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-white/40 dark:border-white/10 animate-slide-up">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3">
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
            📊 User Management
          </span>
          <span className="text-xs bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-full font-bold shadow-lg shadow-indigo-500/30">
            React
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          React • Tailwind CSS
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="stat-card stat-total">
          <span className="text-2xl">👥</span>
          <div>
            <div className="text-xs font-medium opacity-80">Total</div>
            <div className="text-xl font-bold">{userCount}</div>
          </div>
        </div>

        <div className="stat-card stat-api">
          <span className="text-2xl">🌐</span>
          <div>
            <div className="text-xs font-medium opacity-80">API</div>
            <div className="text-xl font-bold">{apiCount}</div>
          </div>
        </div>

        <button onClick={toggleDarkMode} className="theme-toggle">
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}

export default Header;