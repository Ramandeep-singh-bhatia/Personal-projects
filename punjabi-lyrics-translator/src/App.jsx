import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navigation from './components/Navigation';
import LyricsInput from './components/LyricsInput';
import TranslationDisplay from './components/TranslationDisplay';
import Library from './components/Library';
import Timeline from './components/Timeline';
import Suggestions from './components/Suggestions';
import Settings from './components/Settings';
import './index.css';

const AppContent = () => {
  const { currentView, selectedSong, navigateTo } = useApp();
  const [currentTranslation, setCurrentTranslation] = useState(null);

  const handleTranslationComplete = (translationData) => {
    setCurrentTranslation(translationData);
    navigateTo('view');
  };

  const handleBackToInput = () => {
    setCurrentTranslation(null);
    navigateTo('input');
  };

  const handleSaveAndBack = () => {
    setCurrentTranslation(null);
    navigateTo('library');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="py-8">
        {/* Input/Translation View */}
        {currentView === 'input' && (
          <LyricsInput onTranslationComplete={handleTranslationComplete} />
        )}

        {/* Translation Display View */}
        {currentView === 'view' && (currentTranslation || selectedSong) && (
          <TranslationDisplay
            songData={currentTranslation || selectedSong}
            onSave={handleSaveAndBack}
            onBack={currentTranslation ? handleBackToInput : () => navigateTo('library')}
          />
        )}

        {/* Library View */}
        {currentView === 'library' && <Library />}

        {/* Timeline View */}
        {currentView === 'timeline' && <Timeline />}

        {/* Suggestions View */}
        {currentView === 'suggestions' && <Suggestions />}

        {/* Settings View */}
        {currentView === 'settings' && <Settings />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-gray-600 text-sm">
            <p className="mb-2">
              Punjabi Lyrics Translator - Learn Punjabi through music
            </p>
            <p className="text-xs text-gray-500">
              For personal use only. Supports Gurmukhi, Hindi script, and English transliteration.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
