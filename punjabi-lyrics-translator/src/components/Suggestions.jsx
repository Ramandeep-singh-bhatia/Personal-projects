import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getArtistFrequency } from '../utils/stats';
import { extractCommonThemes } from '../utils/crossReference';

const Suggestions = () => {
  const { savedSongs } = useApp();

  // Get top artists
  const topArtists = useMemo(() => {
    return getArtistFrequency(savedSongs).slice(0, 3);
  }, [savedSongs]);

  // Get common themes
  const themes = useMemo(() => {
    return extractCommonThemes(savedSongs).slice(0, 5);
  }, [savedSongs]);

  // Related artist suggestions (hardcoded for now, could be enhanced with API)
  const artistSuggestions = {
    'Karan Aujla': ['Sidhu Moose Wala', 'AP Dhillon', 'Shubh'],
    'Diljit Dosanjh': ['Gurdas Maan', 'Babbu Maan', 'Amrinder Gill'],
    'Sidhu Moose Wala': ['Karan Aujla', 'Khan Bhaini', 'Bohemia'],
    'AP Dhillon': ['Gurinder Gill', 'Shinda Kahlon', 'Karan Aujla'],
    'Gurdas Maan': ['Hans Raj Hans', 'Harbhajan Mann', 'Diljit Dosanjh'],
    'Amrinder Gill': ['Maninder Buttar', 'Sharry Mann', 'Jassi Gill']
  };

  // Theme-based suggestions
  const themeSuggestions = {
    pyar: { type: 'Romantic', artists: ['Amrinder Gill', 'Jassi Gill'] },
    yaari: { type: 'Friendship', artists: ['Sidhu Moose Wala', 'Karan Aujla'] },
    pind: { type: 'Village/Rural', artists: ['Gurdas Maan', 'Babbu Maan'] },
    dil: { type: 'Emotional', artists: ['Diljit Dosanjh', 'Amrinder Gill'] }
  };

  // Generate artist-based suggestions
  const artistBasedSuggestions = useMemo(() => {
    const suggestions = [];
    topArtists.forEach(artist => {
      const related = artistSuggestions[artist.name];
      if (related) {
        related.forEach(relatedArtist => {
          if (!topArtists.find(a => a.name === relatedArtist)) {
            suggestions.push({
              type: 'artist',
              artist: relatedArtist,
              reason: `Similar to ${artist.name}`
            });
          }
        });
      }
    });
    return suggestions.slice(0, 5);
  }, [topArtists]);

  // Generate theme-based suggestions
  const themeBasedSuggestions = useMemo(() => {
    const suggestions = [];
    themes.forEach(theme => {
      const themeSuggestion = themeSuggestions[theme.word];
      if (themeSuggestion) {
        themeSuggestion.artists.forEach(artist => {
          if (!topArtists.find(a => a.name === artist)) {
            suggestions.push({
              type: 'theme',
              artist,
              theme: themeSuggestion.type,
              reason: `You seem to enjoy ${themeSuggestion.type} songs`
            });
          }
        });
      }
    });
    return suggestions.slice(0, 3);
  }, [themes, topArtists]);

  if (savedSongs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-16 text-center">
          <div className="text-gray-400 text-7xl mb-6">💡</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-3">
            No Suggestions Yet
          </h3>
          <p className="text-lg text-gray-600">
            Start translating songs to get personalized recommendations
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-3">
          💡 Smart Suggestions
        </h2>
        <p className="text-lg text-gray-600">
          Based on your listening and translation history
        </p>
      </div>

      {/* Learning Progress Summary */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-lg p-8 mb-8 text-white">
        <h3 className="text-2xl font-bold mb-6">🎯 Your Learning Journey</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-4xl font-bold">{savedSongs.length}</div>
            <div className="text-lg text-orange-100 mt-1">Songs Translated</div>
          </div>
          <div>
            <div className="text-4xl font-bold">{topArtists.length}</div>
            <div className="text-lg text-orange-100 mt-1">Favorite Artists</div>
          </div>
          <div>
            <div className="text-4xl font-bold">{themes.length}</div>
            <div className="text-lg text-orange-100 mt-1">Common Themes</div>
          </div>
        </div>
      </div>

      {/* Artist-Based Suggestions */}
      {artistBasedSuggestions.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            🎤 Artists You Might Like
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {artistBasedSuggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className="p-6 bg-orange-50 border-2 border-orange-200 rounded-xl hover:border-orange-400 transition-colors"
              >
                <div className="font-bold text-xl text-gray-900">
                  {suggestion.artist}
                </div>
                <div className="text-base text-gray-600 mt-2">
                  {suggestion.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Theme-Based Suggestions */}
      {themeBasedSuggestions.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            ❤️ Based on Your Interests
          </h3>
          <div className="space-y-5">
            {themeBasedSuggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className="p-6 bg-blue-50 border-2 border-blue-200 rounded-xl flex items-center justify-between hover:border-blue-400 transition-colors"
              >
                <div>
                  <div className="font-bold text-lg text-gray-900">
                    {suggestion.artist}
                  </div>
                  <div className="text-base text-gray-600 mt-2">
                    {suggestion.reason}
                  </div>
                </div>
                <div className="px-5 py-2 bg-blue-100 text-blue-700 rounded-full text-base font-bold">
                  {suggestion.theme}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Artists Breakdown */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          🏆 Your Top Artists
        </h3>
        {topArtists.length > 0 ? (
          <div className="space-y-6">
            {topArtists.map((artist, idx) => (
              <div key={idx} className="flex items-center gap-6">
                <div className="text-4xl font-bold text-orange-500 w-16">
                  #{idx + 1}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-xl text-gray-900">{artist.name}</div>
                  <div className="text-base text-gray-600 mt-1">
                    {artist.count} song{artist.count > 1 ? 's' : ''} translated
                  </div>
                </div>
                <div className="text-orange-600 font-bold text-xl">
                  {Math.round((artist.count / savedSongs.length) * 100)}%
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-base">No data available</p>
        )}
      </div>

      {/* Common Themes */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          🏷️ Themes You Explore
        </h3>
        {themes.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {themes.map((theme, idx) => (
              <div
                key={idx}
                className="px-6 py-4 bg-purple-100 text-purple-700 rounded-xl font-bold text-base"
              >
                {theme.word}
                <span className="ml-2 text-purple-500">({theme.count})</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-base">No themes detected yet</p>
        )}
      </div>
    </div>
  );
};

export default Suggestions;
