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
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Learning Timeline & Stats
        </h2>
        <p className="text-gray-600">Track your Punjabi learning progress</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-4xl font-bold text-orange-600 mb-2">
            {stats.totalSongs}
          </div>
          <div className="text-gray-600">Total Songs</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {stats.totalLines}
          </div>
          <div className="text-gray-600">Lines Translated</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-4xl font-bold text-green-600 mb-2">
            {stats.thisWeek}
          </div>
          <div className="text-gray-600">This Week</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-4xl font-bold text-purple-600 mb-2">
            {stats.thisMonth}
          </div>
          <div className="text-gray-600">This Month</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Top Artists */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Top Artists
          </h3>
          {artistFrequency.slice(0, 5).length > 0 ? (
            <div className="space-y-3">
              {artistFrequency.slice(0, 5).map((artist, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{artist.name}</div>
                    <div className="text-sm text-gray-500">
                      {artist.count} song{artist.count > 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-orange-500 h-full rounded-full"
                      style={{
                        width: `${(artist.count / stats.totalSongs) * 100}%`
                      }}
                    />
                  </div>
                  <div className="text-orange-600 font-semibold">
                    {Math.round((artist.count / stats.totalSongs) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No data yet</p>
          )}
        </div>

        {/* Common Themes */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Common Themes
          </h3>
          {commonThemes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {commonThemes.map((theme, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                >
                  {theme.word} ({theme.count})
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No themes detected yet</p>
          )}
        </div>
      </div>

      {/* Most Translated Artist Highlight */}
      {stats.mostTranslatedArtist && (
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg shadow-lg p-6 mb-6 text-white">
          <div className="text-sm font-medium mb-1">Most Translated Artist</div>
          <div className="text-3xl font-bold">{stats.mostTranslatedArtist.name}</div>
          <div className="text-orange-100 mt-1">
            {stats.mostTranslatedArtist.count} songs translated
          </div>
        </div>
      )}

      {/* Timeline View */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 md:mb-0">
            Translation History
          </h3>

          {/* Period Filter */}
          <div className="flex gap-2 flex-wrap">
            {periodOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setSelectedPeriod(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === option.value
                    ? 'bg-orange-500 text-white'
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
          <div className="space-y-6">
            {Object.entries(songsByDate).map(([date, songs]) => (
              <div key={date}>
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-3" />
                  <h4 className="text-lg font-semibold text-gray-900">{date}</h4>
                  <div className="ml-3 text-sm text-gray-500">
                    ({songs.length} song{songs.length > 1 ? 's' : ''})
                  </div>
                </div>

                <div className="ml-6 border-l-2 border-orange-200 pl-6 space-y-3">
                  {songs.map(song => (
                    <div
                      key={song.id}
                      className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => viewSong(song)}
                    >
                      <div className="font-medium text-gray-900">
                        {song.songName}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {song.artist} • {song.lyrics?.length || 0} lines
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <p className="text-gray-600">
              No songs found for the selected period
            </p>
          </div>
        )}
      </div>

      {/* Activity Summary */}
      <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Stats
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {stats.artistCount}
            </div>
            <div className="text-sm text-gray-600">Different Artists</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {stats.averageLinesPerSong}
            </div>
            <div className="text-sm text-gray-600">Avg Lines/Song</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {commonThemes.length}
            </div>
            <div className="text-sm text-gray-600">Common Themes</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {periodSongs.length}
            </div>
            <div className="text-sm text-gray-600">In Selected Period</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
