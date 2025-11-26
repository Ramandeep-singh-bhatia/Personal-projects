// localStorage utility functions for managing saved songs

const STORAGE_KEY = 'punjabi_songs';

export const getSavedSongs = () => {
  try {
    const songs = localStorage.getItem(STORAGE_KEY);
    return songs ? JSON.parse(songs) : [];
  } catch (error) {
    console.error('Error loading saved songs:', error);
    return [];
  }
};

export const saveSong = (song) => {
  try {
    const songs = getSavedSongs();
    const newSong = {
      ...song,
      id: song.id || `song-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      savedAt: song.savedAt || new Date().toISOString()
    };

    // Check if song already exists (by name and artist)
    const existingIndex = songs.findIndex(
      s => s.songName.toLowerCase() === newSong.songName.toLowerCase() &&
           s.artist.toLowerCase() === newSong.artist.toLowerCase()
    );

    if (existingIndex >= 0) {
      // Update existing song
      songs[existingIndex] = newSong;
    } else {
      // Add new song
      songs.unshift(newSong);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
    return newSong;
  } catch (error) {
    console.error('Error saving song:', error);
    throw error;
  }
};

export const deleteSong = (songId) => {
  try {
    const songs = getSavedSongs();
    const filteredSongs = songs.filter(song => song.id !== songId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredSongs));
    return true;
  } catch (error) {
    console.error('Error deleting song:', error);
    return false;
  }
};

export const getSongById = (songId) => {
  const songs = getSavedSongs();
  return songs.find(song => song.id === songId);
};

export const exportSongs = () => {
  const songs = getSavedSongs();
  const dataStr = JSON.stringify(songs, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `punjabi-songs-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

export const importSongs = (jsonData) => {
  try {
    const importedSongs = JSON.parse(jsonData);
    if (!Array.isArray(importedSongs)) {
      throw new Error('Invalid format: expected an array of songs');
    }

    const existingSongs = getSavedSongs();
    const mergedSongs = [...importedSongs, ...existingSongs];

    // Remove duplicates based on id
    const uniqueSongs = mergedSongs.reduce((acc, song) => {
      if (!acc.find(s => s.id === song.id)) {
        acc.push(song);
      }
      return acc;
    }, []);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(uniqueSongs));
    return uniqueSongs.length;
  } catch (error) {
    console.error('Error importing songs:', error);
    throw error;
  }
};
