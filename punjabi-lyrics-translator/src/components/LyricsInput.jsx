import { useState } from 'react';
import { fetchLyrics } from '../services/lyricsService';
import { translateLyrics } from '../services/translationService';
import { useApp } from '../context/AppContext';

const LyricsInput = ({ onTranslationComplete }) => {
  const { apiKey, lyricsApiUrl } = useApp();
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Translate Punjabi Lyrics
        </h2>

        {/* Mode Toggle */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setMode('auto')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === 'auto'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Auto Fetch Lyrics
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === 'manual'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Manual Entry
          </button>
        </div>

        {/* Song Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Song Name *
            </label>
            <input
              type="text"
              value={songName}
              onChange={(e) => setSongName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter song name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Artist Name *
            </label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter artist name"
            />
          </div>
        </div>

        {/* Auto Fetch Mode */}
        {mode === 'auto' && (
          <div className="mb-4">
            <button
              onClick={handleFetchLyrics}
              disabled={fetchingLyrics}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {fetchingLyrics ? 'Fetching Lyrics...' : 'Fetch Lyrics'}
            </button>
          </div>
        )}

        {/* Lyrics Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Punjabi Lyrics *
            <span className="text-xs text-gray-500 ml-2">
              (Can be in Gurmukhi, Hindi script, or English transliteration)
            </span>
          </label>
          <textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent script-support"
            rows="12"
            placeholder={`Enter lyrics here...

Example formats:
• Gurmukhi: ਤੇਰੇ ਨਾਲ ਪਿਆਰ ਹੋ ਗਿਆ
• Hindi: तेरे नाल प्यार हो गया
• English: tere naal pyar ho gaya`}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleTranslate}
            disabled={loading}
            className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Translating...' : 'Translate'}
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Clear
          </button>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="mt-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-gray-600">
              Translating your lyrics...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LyricsInput;
