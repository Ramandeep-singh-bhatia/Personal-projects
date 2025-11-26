import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { exportSongs } from '../utils/storage';

const Library = () => {
  const { savedSongs, viewSong, deleteSong } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterArtist, setFilterArtist] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date', 'name', 'artist'
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Get unique artists for filter
  const artists = useMemo(() => {
    const uniqueArtists = [...new Set(savedSongs.map(song => song.artist))];
    return uniqueArtists.sort();
  }, [savedSongs]);

  // Filter and sort songs
  const filteredSongs = useMemo(() => {
    let filtered = savedSongs;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        song =>
          song.songName.toLowerCase().includes(term) ||
          song.artist.toLowerCase().includes(term)
      );
    }

    // Artist filter
    if (filterArtist) {
      filtered = filtered.filter(song => song.artist === filterArtist);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.songName.localeCompare(b.songName);
        case 'artist':
          return a.artist.localeCompare(b.artist);
        case 'date':
        default:
          return new Date(b.savedAt) - new Date(a.savedAt);
      }
    });

    return filtered;
  }, [savedSongs, searchTerm, filterArtist, sortBy]);

  const handleDelete = (songId) => {
    if (deleteConfirm === songId) {
      deleteSong(songId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(songId);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-4xl font-bold text-gray-900">📚 Saved Songs Library</h2>
          <div className="flex gap-4 mt-6 md:mt-0">
            <button
              onClick={exportSongs}
              className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-md"
            >
              📥 Export JSON
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="p-6 bg-orange-50 rounded-xl border-2 border-orange-100">
            <div className="text-3xl font-bold text-orange-600">
              {savedSongs.length}
            </div>
            <div className="text-base text-gray-600 mt-1">Total Songs</div>
          </div>
          <div className="p-6 bg-blue-50 rounded-xl border-2 border-blue-100">
            <div className="text-3xl font-bold text-blue-600">{artists.length}</div>
            <div className="text-base text-gray-600 mt-1">Artists</div>
          </div>
          <div className="p-6 bg-green-50 rounded-xl border-2 border-green-100">
            <div className="text-3xl font-bold text-green-600">
              {savedSongs.reduce((sum, song) => sum + (song.lyrics?.length || 0), 0)}
            </div>
            <div className="text-base text-gray-600 mt-1">Total Lines</div>
          </div>
          <div className="p-6 bg-purple-50 rounded-xl border-2 border-purple-100">
            <div className="text-3xl font-bold text-purple-600">
              {savedSongs.length > 0
                ? Math.round(
                    savedSongs.reduce(
                      (sum, song) => sum + (song.lyrics?.length || 0),
                      0
                    ) / savedSongs.length
                  )
                : 0}
            </div>
            <div className="text-base text-gray-600 mt-1">Avg Lines/Song</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🔍 Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by song or artist..."
              className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🎤 Filter by Artist
            </label>
            <select
              value={filterArtist}
              onChange={(e) => setFilterArtist(e.target.value)}
              className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            >
              <option value="">All Artists</option>
              {artists.map(artist => (
                <option key={artist} value={artist}>
                  {artist}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              📊 Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            >
              <option value="date">Date (Newest First)</option>
              <option value="name">Song Name</option>
              <option value="artist">Artist Name</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-base text-gray-600 font-medium">
          Showing <strong>{filteredSongs.length}</strong> of <strong>{savedSongs.length}</strong> songs
        </div>
      </div>

      {/* Songs List */}
      {filteredSongs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-16 text-center">
          <div className="text-gray-400 text-7xl mb-6">♪</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-3">
            {searchTerm || filterArtist
              ? 'No songs found'
              : 'No saved songs yet'}
          </h3>
          <p className="text-lg text-gray-600">
            {searchTerm || filterArtist
              ? 'Try adjusting your search or filters'
              : 'Start translating some Punjabi lyrics to build your library'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSongs.map(song => (
            <div
              key={song.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6">
                <h3 className="text-white font-bold text-xl truncate">
                  {song.songName}
                </h3>
                <p className="text-orange-100 text-base truncate mt-1">{song.artist}</p>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between text-base text-gray-600 mb-6">
                  <span className="font-medium">📄 {song.lyrics?.length || 0} lines</span>
                  <span className="text-sm">{formatDate(song.savedAt)}</span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => viewSong(song)}
                    className="flex-1 px-5 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-md"
                  >
                    👁️ View
                  </button>
                  <button
                    onClick={() => handleDelete(song.id)}
                    className={`px-5 py-3 rounded-lg font-semibold transition-colors ${
                      deleteConfirm === song.id
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {deleteConfirm === song.id ? '⚠️ Confirm?' : '🗑️ Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Library;
