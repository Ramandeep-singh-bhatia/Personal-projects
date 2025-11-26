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
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">💡</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Suggestions Yet
          </h3>
          <p className="text-gray-600">
            Start translating songs to get personalized recommendations
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Smart Suggestions
        </h2>
        <p className="text-gray-600">
          Based on your listening and translation history
        </p>
      </div>

      {/* Learning Progress Summary */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg shadow-lg p-6 mb-6 text-white">
        <h3 className="text-xl font-semibold mb-4">Your Learning Journey</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-3xl font-bold">{savedSongs.length}</div>
            <div className="text-orange-100">Songs Translated</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{topArtists.length}</div>
            <div className="text-orange-100">Favorite Artists</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{themes.length}</div>
            <div className="text-orange-100">Common Themes</div>
          </div>
        </div>
      </div>

      {/* Artist-Based Suggestions */}
      {artistBasedSuggestions.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Artists You Might Like
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {artistBasedSuggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className="p-4 bg-orange-50 border border-orange-200 rounded-lg"
              >
                <div className="font-semibold text-gray-900 text-lg">
                  {suggestion.artist}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {suggestion.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Theme-Based Suggestions */}
      {themeBasedSuggestions.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Based on Your Interests
          </h3>
          <div className="space-y-4">
            {themeBasedSuggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-gray-900">
                    {suggestion.artist}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {suggestion.reason}
                  </div>
                </div>
                <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {suggestion.theme}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Artists Breakdown */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Your Top Artists
        </h3>
        {topArtists.length > 0 ? (
          <div className="space-y-4">
            {topArtists.map((artist, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="text-3xl font-bold text-orange-500 w-12">
                  #{idx + 1}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{artist.name}</div>
                  <div className="text-sm text-gray-600">
                    {artist.count} song{artist.count > 1 ? 's' : ''} translated
                  </div>
                </div>
                <div className="text-orange-600 font-semibold">
                  {Math.round((artist.count / savedSongs.length) * 100)}%
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No data available</p>
        )}
      </div>

      {/* Common Themes */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Themes You Explore
        </h3>
        {themes.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {themes.map((theme, idx) => (
              <div
                key={idx}
                className="px-4 py-3 bg-purple-100 text-purple-700 rounded-lg font-medium"
              >
                {theme.word}
                <span className="ml-2 text-purple-500">({theme.count})</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No themes detected yet</p>
        )}
      </div>
    </div>
  );
};

export default Suggestions;
