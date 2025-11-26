import { createContext, useContext, useState, useEffect } from 'react';
import { getSavedSongs, saveSong, deleteSong } from '../utils/storage';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [savedSongs, setSavedSongs] = useState([]);
  const [currentView, setCurrentView] = useState('input'); // 'input', 'library', 'timeline'
  const [selectedSong, setSelectedSong] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [lyricsApiUrl, setLyricsApiUrl] = useState('https://api.lyrics.ovh/v1');

  // Load saved songs on mount
  useEffect(() => {
    const songs = getSavedSongs();
    setSavedSongs(songs);
  }, []);

  // Save a new song
  const handleSaveSong = (song) => {
    const savedSong = saveSong(song);
    setSavedSongs(getSavedSongs());
    return savedSong;
  };

  // Delete a song
  const handleDeleteSong = (songId) => {
    if (deleteSong(songId)) {
      setSavedSongs(getSavedSongs());
      if (selectedSong?.id === songId) {
        setSelectedSong(null);
      }
      return true;
    }
    return false;
  };

  // View a saved song
  const viewSong = (song) => {
    setSelectedSong(song);
    setCurrentView('view');
  };

  // Navigate between views
  const navigateTo = (view) => {
    setCurrentView(view);
    if (view === 'input') {
      setSelectedSong(null);
    }
  };

  const value = {
    savedSongs,
    currentView,
    selectedSong,
    apiKey,
    lyricsApiUrl,
    setApiKey,
    setLyricsApiUrl,
    saveSong: handleSaveSong,
    deleteSong: handleDeleteSong,
    viewSong,
    navigateTo,
    setSelectedSong
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
