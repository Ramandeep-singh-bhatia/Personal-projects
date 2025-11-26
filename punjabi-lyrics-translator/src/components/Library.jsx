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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">📚 Your Library</h1>
              <p className="text-xl text-orange-100">
                {savedSongs.length} {savedSongs.length === 1 ? 'song' : 'songs'} in your collection
              </p>
            </div>
            <button
              onClick={exportSongs}
              className="mt-6 md:mt-0 px-8 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg hover:bg-orange-50 transition-all shadow-xl transform hover:scale-105"
            >
              <span className="mr-2">📥</span>
              Export Collection
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100 transform hover:scale-105 transition-transform">
            <div className="text-5xl font-bold text-orange-600 mb-2">
              {savedSongs.length}
            </div>
            <div className="text-lg text-gray-600 font-semibold">Total Songs</div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100 transform hover:scale-105 transition-transform">
            <div className="text-5xl font-bold text-blue-600 mb-2">{artists.length}</div>
            <div className="text-lg text-gray-600 font-semibold">Artists</div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100 transform hover:scale-105 transition-transform">
            <div className="text-5xl font-bold text-green-600 mb-2">
              {savedSongs.reduce((sum, song) => sum + (song.lyrics?.length || 0), 0)}
            </div>
            <div className="text-lg text-gray-600 font-semibold">Total Lines</div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100 transform hover:scale-105 transition-transform">
            <div className="text-5xl font-bold text-purple-600 mb-2">
              {savedSongs.length > 0
                ? Math.round(
                    savedSongs.reduce(
                      (sum, song) => sum + (song.lyrics?.length || 0),
                      0
                    ) / savedSongs.length
                  )
                : 0}
            </div>
            <div className="text-lg text-gray-600 font-semibold">Avg Lines/Song</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="text-3xl mr-3">🔍</span>
            Find Your Songs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by song or artist..."
                className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Filter by Artist
              </label>
              <select
                value={filterArtist}
                onChange={(e) => setFilterArtist(e.target.value)}
                className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm"
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
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm"
              >
                <option value="date">Date (Newest First)</option>
                <option value="name">Song Name</option>
                <option value="artist">Artist Name</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 text-lg text-gray-600 font-semibold bg-orange-50 px-6 py-3 rounded-xl inline-block">
            Showing <span className="text-orange-600 font-bold">{filteredSongs.length}</span> of <span className="text-orange-600 font-bold">{savedSongs.length}</span> songs
          </div>
        </div>

        {/* Songs List */}
        {filteredSongs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-20 text-center border border-gray-100">
            <div className="text-gray-400 text-8xl mb-8">♪</div>
            <h3 className="text-3xl font-bold text-gray-700 mb-4">
              {searchTerm || filterArtist
                ? 'No songs found'
                : 'No saved songs yet'}
            </h3>
            <p className="text-xl text-gray-600 mb-8">
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
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500 p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative z-10">
                    <h3 className="text-white font-bold text-2xl mb-2 truncate">
                      {song.songName}
                    </h3>
                    <p className="text-orange-100 text-lg truncate">{song.artist}</p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between text-base text-gray-600 mb-6 bg-gray-50 px-4 py-3 rounded-xl">
                    <span className="font-bold flex items-center">
                      <span className="text-2xl mr-2">📄</span>
                      {song.lyrics?.length || 0} lines
                    </span>
                    <span className="text-sm bg-white px-3 py-1 rounded-full font-semibold">{formatDate(song.savedAt)}</span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => viewSong(song)}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-lg hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg transform hover:scale-105"
                    >
                      <span className="mr-2">👁️</span>
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(song.id)}
                      className={`px-6 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                        deleteConfirm === song.id
                          ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {deleteConfirm === song.id ? '⚠️' : '🗑️'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
