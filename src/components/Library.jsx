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
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Saved Songs Library</h2>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={exportSongs}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Export JSON
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {savedSongs.length}
            </div>
            <div className="text-sm text-gray-600">Total Songs</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{artists.length}</div>
            <div className="text-sm text-gray-600">Artists</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {savedSongs.reduce((sum, song) => sum + (song.lyrics?.length || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Total Lines</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {savedSongs.length > 0
                ? Math.round(
                    savedSongs.reduce(
                      (sum, song) => sum + (song.lyrics?.length || 0),
                      0
                    ) / savedSongs.length
                  )
                : 0}
            </div>
            <div className="text-sm text-gray-600">Avg Lines/Song</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by song or artist..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Artist
            </label>
            <select
              value={filterArtist}
              onChange={(e) => setFilterArtist(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="date">Date (Newest First)</option>
              <option value="name">Song Name</option>
              <option value="artist">Artist Name</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600 mb-4">
          Showing {filteredSongs.length} of {savedSongs.length} songs
        </div>
      </div>

      {/* Songs List */}
      {filteredSongs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">♪</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {searchTerm || filterArtist
              ? 'No songs found'
              : 'No saved songs yet'}
          </h3>
          <p className="text-gray-600">
            {searchTerm || filterArtist
              ? 'Try adjusting your search or filters'
              : 'Start translating some Punjabi lyrics to build your library'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSongs.map(song => (
            <div
              key={song.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4">
                <h3 className="text-white font-semibold text-lg truncate">
                  {song.songName}
                </h3>
                <p className="text-orange-100 text-sm truncate">{song.artist}</p>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>{song.lyrics?.length || 0} lines</span>
                  <span>{formatDate(song.savedAt)}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => viewSong(song)}
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(song.id)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      deleteConfirm === song.id
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {deleteConfirm === song.id ? 'Confirm?' : 'Delete'}
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
