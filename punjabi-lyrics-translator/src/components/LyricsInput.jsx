import { useState } from 'react';
import { fetchLyrics } from '../services/lyricsService';
import { translateLyrics } from '../services/translationService';
import { useApp } from '../context/AppContext';

const LyricsInput = ({ onTranslationComplete }) => {
  const { apiKey, lyricsApiUrl, navigateTo } = useApp();
  const [mode, setMode] = useState('auto'); // 'auto' or 'manual'
  const [songName, setSongName] = useState('');
  const [artist, setArtist] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchingLyrics, setFetchingLyrics] = useState(false);

  const handleFetchLyrics = async () => {
    if (!artist.trim() || !songName.trim()) {
      setError('Please enter both artist and song name');
      return;
    }

    setFetchingLyrics(true);
    setError('');

    try {
      const fetchedLyrics = await fetchLyrics(artist, songName, lyricsApiUrl);
      setLyrics(fetchedLyrics);
      setError('');
    } catch (err) {
      setError(err.message);
      // Switch to manual mode if fetch fails
      setMode('manual');
    } finally {
      setFetchingLyrics(false);
    }
  };

  const handleTranslate = async () => {
    if (!lyrics.trim()) {
      setError('Please enter lyrics to translate');
      return;
    }

    if (!songName.trim() || !artist.trim()) {
      setError('Please enter song name and artist');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const translations = await translateLyrics(lyrics, apiKey);

      const songData = {
        songName: songName.trim(),
        artist: artist.trim(),
        lyrics: translations
      };

      onTranslationComplete(songData);
    } catch (err) {
      setError(err.message || 'Translation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSongName('');
    setArtist('');
    setLyrics('');
    setError('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Translate Punjabi Lyrics
          </h2>
          <p className="text-gray-600">
            Support for Gurmukhi, Hindi script, and English transliteration
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Input Method
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => setMode('auto')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                mode === 'auto'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🔍 Auto Fetch Lyrics
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                mode === 'manual'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ✍️ Manual Entry
            </button>
          </div>
        </div>

        {/* Song Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Song Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={songName}
              onChange={(e) => setSongName(e.target.value)}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="e.g., Boyfriend"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Artist Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="e.g., Karan Aujla"
            />
          </div>
        </div>

        {/* Auto Fetch Button */}
        {mode === 'auto' && (
          <div className="mb-8">
            <button
              onClick={handleFetchLyrics}
              disabled={fetchingLyrics}
              className="w-full bg-green-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              {fetchingLyrics ? '⏳ Fetching Lyrics...' : '🔍 Fetch Lyrics from API'}
            </button>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Note: Auto-fetch may not work for all Punjabi songs
            </p>
          </div>
        )}

        {/* Lyrics Input */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Punjabi Lyrics <span className="text-red-500">*</span>
          </label>
          <div className="text-xs text-gray-500 mb-3 bg-blue-50 p-3 rounded-lg">
            💡 <strong>Tip:</strong> You can enter lyrics in Gurmukhi (ਪੰਜਾਬੀ), Hindi script (पंजाबी),
            or English transliteration (punjabi)
          </div>
          <textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors script-support resize-y"
            rows="20"
            placeholder={`Paste or type your lyrics here...

Example:
तेरे नाल प्यार हो गया
दिल दे मामले विच उलझ गया

Or in English:
tere naal pyar ho gaya
dil de mamle vich ulajh gaya`}
          />
          <p className="text-sm text-gray-500 mt-2">
            {lyrics.split('\n').filter(line => line.trim()).length} lines • {lyrics.length} characters
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <div className="flex items-start">
              <span className="text-red-500 text-xl mr-3">⚠️</span>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleTranslate}
            disabled={loading}
            className="flex-1 bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            {loading ? '⏳ Translating...' : '🎯 Translate to Hindi & English'}
          </button>
          <button
            onClick={handleClear}
            className="sm:w-auto px-8 py-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            🗑️ Clear All
          </button>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="mt-8 p-6 bg-orange-50 rounded-lg">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-orange-500"></div>
              <span className="ml-4 text-gray-700 font-medium text-lg">
                Translating your lyrics... This may take a moment.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LyricsInput;
