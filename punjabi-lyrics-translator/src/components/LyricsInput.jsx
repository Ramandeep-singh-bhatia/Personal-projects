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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            🎵 Punjabi Lyrics Translator
          </h1>
          <p className="text-xl md:text-2xl text-orange-100 mb-2">
            Translate & Learn Punjabi Through Music
          </p>
          <p className="text-base text-orange-50">
            Support for Gurmukhi (ਪੰਜਾਬੀ), Hindi script (पंजाबी), and English transliteration
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Song Info & Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Mode Selection Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">⚙️</span>
                Input Method
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setMode('auto')}
                  className={`w-full px-6 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                    mode === 'auto'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <span className="text-2xl mr-2">🔍</span>
                    <span>Auto Fetch</span>
                  </div>
                </button>
                <button
                  onClick={() => setMode('manual')}
                  className={`w-full px-6 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                    mode === 'manual'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <span className="text-2xl mr-2">✍️</span>
                    <span>Manual Entry</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Song Details Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">🎤</span>
                Song Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Song Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={songName}
                    onChange={(e) => setSongName(e.target.value)}
                    className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all"
                    placeholder="e.g., Boyfriend"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Artist Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all"
                    placeholder="e.g., Karan Aujla"
                  />
                </div>
                {mode === 'auto' && (
                  <button
                    onClick={handleFetchLyrics}
                    disabled={fetchingLyrics}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl font-bold text-base hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg transform hover:scale-105"
                  >
                    {fetchingLyrics ? (
                      <>
                        <span className="inline-block animate-spin mr-2">⏳</span>
                        Fetching...
                      </>
                    ) : (
                      <>
                        <span className="mr-2">🔍</span>
                        Fetch Lyrics
                      </>
                    )}
                  </button>
                )}
              </div>
              {mode === 'auto' && (
                <p className="text-xs text-gray-500 mt-3 text-center bg-gray-50 p-2 rounded-lg">
                  ℹ️ Auto-fetch may not work for all songs
                </p>
              )}
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
              <h4 className="font-bold text-blue-900 mb-2 flex items-center">
                <span className="text-xl mr-2">💡</span>
                Did You Know?
              </h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                You can enter lyrics in Gurmukhi, Hindi script, or English transliteration. Our AI will detect and translate automatically!
              </p>
            </div>
          </div>

          {/* Right Main Area - Lyrics Input */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="text-3xl mr-3">📝</span>
                  Your Lyrics
                </h3>
                <div className="text-sm font-semibold text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
                  {lyrics.split('\n').filter(line => line.trim()).length} lines • {lyrics.length} chars
                </div>
              </div>

              <textarea
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all script-support resize-none shadow-inner bg-gradient-to-br from-gray-50 to-white"
                rows="24"
                placeholder={`✨ Paste or type your Punjabi lyrics here...

Example in Hindi script:
तेरे नाल प्यार हो गया
दिल दे मामले विच उलझ गया

Example in English:
tere naal pyar ho gaya
dil de mamle vich ulajh gaya

Or use Gurmukhi script (ਪੰਜਾਬੀ)!`}
              />

              {/* Error Message */}
              {error && (
                <div className="mt-6 p-5 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-xl">
                  <div className="flex items-start">
                    <span className="text-red-500 text-2xl mr-3">⚠️</span>
                    <p className="text-red-700 font-semibold text-base">{error}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  onClick={handleTranslate}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-10 py-5 rounded-xl font-bold text-xl hover:from-orange-700 hover:to-amber-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-2xl transform hover:scale-105"
                >
                  {loading ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⏳</span>
                      Translating...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">🚀</span>
                      Translate Now
                    </>
                  )}
                </button>
                <button
                  onClick={handleClear}
                  className="px-10 py-5 bg-gray-200 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-300 transition-all transform hover:scale-105"
                >
                  <span className="mr-2">🗑️</span>
                  Clear
                </button>
              </div>

              {/* Loading Indicator */}
              {loading && (
                <div className="mt-8 p-8 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-200">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mb-4"></div>
                    <p className="text-gray-800 font-bold text-xl text-center">
                      ✨ Translating your lyrics with AI...
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                      This may take 10-30 seconds
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LyricsInput;
