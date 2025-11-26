import { useApp } from '../context/AppContext';

const Navigation = () => {
  const { currentView, navigateTo, savedSongs } = useApp();

  const navItems = [
    { id: 'input', label: 'Translate', icon: '✍️' },
    { id: 'library', label: 'Library', icon: '📚', badge: savedSongs.length },
    { id: 'timeline', label: 'Timeline', icon: '📅' },
    { id: 'suggestions', label: 'Suggestions', icon: '💡' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <nav className="bg-gradient-to-r from-orange-500 to-amber-500 shadow-xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="text-white text-3xl font-bold">
              🎵 Punjabi Lyrics Translator
            </div>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-3">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`relative px-6 py-3 rounded-lg text-base font-semibold transition-all ${
                  currentView === item.id || (currentView === 'view' && item.id === 'library')
                    ? 'bg-white text-orange-600 shadow-lg scale-105'
                    : 'text-white hover:bg-orange-600 hover:scale-105'
                }`}
              >
                <span className="mr-2 text-lg">{item.icon}</span>
                {item.label}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <div className="flex items-center space-x-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`relative p-3 rounded-lg transition-all ${
                    currentView === item.id || (currentView === 'view' && item.id === 'library')
                      ? 'bg-white text-orange-600 shadow-lg scale-110'
                      : 'text-white hover:bg-orange-600 hover:scale-110'
                  }`}
                  title={item.label}
                >
                  <span className="text-2xl">{item.icon}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
