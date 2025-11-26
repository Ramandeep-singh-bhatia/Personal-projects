import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  calculateStats,
  getSongsInPeriod,
  getActivityCalendar,
  getArtistFrequency
} from '../utils/stats';
import { extractCommonThemes } from '../utils/crossReference';

const Timeline = () => {
  const { savedSongs, viewSong } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('all'); // 'today', 'week', 'month', '3months', 'all'

  // Calculate stats
  const stats = useMemo(() => calculateStats(savedSongs), [savedSongs]);
  const artistFrequency = useMemo(() => getArtistFrequency(savedSongs), [savedSongs]);
  const commonThemes = useMemo(() => extractCommonThemes(savedSongs), [savedSongs]);
  const activityCalendar = useMemo(() => getActivityCalendar(savedSongs, 3), [savedSongs]);

  // Get songs for selected period
  const periodSongs = useMemo(
    () => getSongsInPeriod(savedSongs, selectedPeriod),
    [savedSongs, selectedPeriod]
  );

  // Group songs by date for timeline display
  const songsByDate = useMemo(() => {
    const grouped = {};
    periodSongs.forEach(song => {
      const date = new Date(song.savedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(song);
    });
    return grouped;
  }, [periodSongs]);

  const periodOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: '3months', label: 'Last 3 Months' },
    { value: 'all', label: 'All Time' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-3">
          📅 Learning Timeline & Stats
        </h2>
        <p className="text-lg text-gray-600">Track your Punjabi learning progress</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-5xl font-bold text-orange-600 mb-3">
            {stats.totalSongs}
          </div>
          <div className="text-base text-gray-600">Total Songs</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-5xl font-bold text-blue-600 mb-3">
            {stats.totalLines}
          </div>
          <div className="text-base text-gray-600">Lines Translated</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-5xl font-bold text-green-600 mb-3">
            {stats.thisWeek}
          </div>
          <div className="text-base text-gray-600">This Week</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-5xl font-bold text-purple-600 mb-3">
            {stats.thisMonth}
          </div>
          <div className="text-base text-gray-600">This Month</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Top Artists */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            🎤 Top Artists
          </h3>
          {artistFrequency.slice(0, 5).length > 0 ? (
            <div className="space-y-5">
              {artistFrequency.slice(0, 5).map((artist, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-lg text-gray-900">{artist.name}</div>
                    <div className="text-base text-gray-500">
                      {artist.count} song{artist.count > 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="flex-1 mx-6 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-orange-500 h-full rounded-full"
                      style={{
                        width: `${(artist.count / stats.totalSongs) * 100}%`
                      }}
                    />
                  </div>
                  <div className="text-orange-600 font-bold text-lg">
                    {Math.round((artist.count / stats.totalSongs) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-base">No data yet</p>
          )}
        </div>

        {/* Common Themes */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            🏷️ Common Themes
          </h3>
          {commonThemes.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {commonThemes.map((theme, idx) => (
                <div
                  key={idx}
                  className="px-5 py-3 bg-orange-100 text-orange-700 rounded-full text-base font-semibold"
                >
                  {theme.word} ({theme.count})
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-base">No themes detected yet</p>
          )}
        </div>
      </div>

      {/* Most Translated Artist Highlight */}
      {stats.mostTranslatedArtist && (
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-lg p-8 mb-8 text-white">
          <div className="text-base font-semibold mb-2 text-orange-100">Most Translated Artist</div>
          <div className="text-4xl font-bold">{stats.mostTranslatedArtist.name}</div>
          <div className="text-lg text-orange-100 mt-2">
            {stats.mostTranslatedArtist.count} songs translated
          </div>
        </div>
      )}

      {/* Timeline View */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 md:mb-0">
            🕐 Translation History
          </h3>

          {/* Period Filter */}
          <div className="flex gap-3 flex-wrap">
            {periodOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setSelectedPeriod(option.value)}
                className={`px-5 py-3 rounded-lg font-semibold text-base transition-all ${
                  selectedPeriod === option.value
                    ? 'bg-orange-500 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Songs by Date */}
        {Object.keys(songsByDate).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(songsByDate).map(([date, songs]) => (
              <div key={date}>
                <div className="flex items-center mb-4">
                  <div className="w-4 h-4 bg-orange-500 rounded-full mr-4" />
                  <h4 className="text-xl font-bold text-gray-900">{date}</h4>
                  <div className="ml-4 text-base text-gray-500 font-medium">
                    ({songs.length} song{songs.length > 1 ? 's' : ''})
                  </div>
                </div>

                <div className="ml-8 border-l-4 border-orange-200 pl-8 space-y-4">
                  {songs.map(song => (
                    <div
                      key={song.id}
                      className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-all cursor-pointer border-2 border-transparent hover:border-orange-300"
                      onClick={() => viewSong(song)}
                    >
                      <div className="font-bold text-lg text-gray-900">
                        {song.songName}
                      </div>
                      <div className="text-base text-gray-600 mt-2">
                        {song.artist} • {song.lyrics?.length || 0} lines
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 text-7xl mb-6">📅</div>
            <p className="text-lg text-gray-600">
              No songs found for the selected period
            </p>
          </div>
        )}
      </div>

      {/* Activity Summary */}
      <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          📈 Quick Stats
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-xl border-2 border-blue-100">
            <div className="text-3xl font-bold text-blue-600">
              {stats.artistCount}
            </div>
            <div className="text-base text-gray-600 mt-1">Different Artists</div>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-xl border-2 border-green-100">
            <div className="text-3xl font-bold text-green-600">
              {stats.averageLinesPerSong}
            </div>
            <div className="text-base text-gray-600 mt-1">Avg Lines/Song</div>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-xl border-2 border-purple-100">
            <div className="text-3xl font-bold text-purple-600">
              {commonThemes.length}
            </div>
            <div className="text-base text-gray-600 mt-1">Common Themes</div>
          </div>
          <div className="text-center p-6 bg-orange-50 rounded-xl border-2 border-orange-100">
            <div className="text-3xl font-bold text-orange-600">
              {periodSongs.length}
            </div>
            <div className="text-base text-gray-600 mt-1">In Selected Period</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
