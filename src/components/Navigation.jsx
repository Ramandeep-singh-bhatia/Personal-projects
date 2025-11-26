import { useApp } from '../context/AppContext';

const Navigation = () => {
  const { currentView, navigateTo, savedSongs } = useApp();

  const navItems = [
    { id: 'input', label: 'Translate', icon: '✍️' },
    { id: 'library', label: 'Library', icon: '📚', badge: savedSongs.length },
    { id: 'timeline', label: 'Timeline', icon: '📅' },
    { id: 'suggestions', label: 'Suggestions', icon: '💡' }
  ];

  return (
    <nav className="bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="text-white text-2xl font-bold">
              🎵 Punjabi Lyrics Translator
            </div>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`relative px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === item.id || (currentView === 'view' && item.id === 'library')
                    ? 'bg-white text-orange-600'
                    : 'text-white hover:bg-orange-600'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
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
                  className={`relative p-2 rounded-lg transition-colors ${
                    currentView === item.id || (currentView === 'view' && item.id === 'library')
                      ? 'bg-white text-orange-600'
                      : 'text-white hover:bg-orange-600'
                  }`}
                  title={item.label}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
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
