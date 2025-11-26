// Statistics and timeline utilities

// Get songs grouped by date
export const getSongsByDate = (songs) => {
  const grouped = {};

  songs.forEach(song => {
    const date = new Date(song.savedAt);
    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(song);
  });

  return grouped;
};

// Get songs for a specific time period
export const getSongsInPeriod = (songs, period) => {
  const now = new Date();
  const startDate = new Date();

  switch (period) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case '3months':
      startDate.setMonth(now.getMonth() - 3);
      break;
    default:
      return songs;
  }

  return songs.filter(song => new Date(song.savedAt) >= startDate);
};

// Calculate statistics
export const calculateStats = (songs) => {
  if (!songs || songs.length === 0) {
    return {
      totalSongs: 0,
      totalLines: 0,
      mostTranslatedArtist: null,
      artistCount: 0,
      thisWeek: 0,
      thisMonth: 0,
      averageLinesPerSong: 0
    };
  }

  // Artist frequency
  const artistFrequency = {};
  let totalLines = 0;

  songs.forEach(song => {
    const artist = song.artist || 'Unknown';
    artistFrequency[artist] = (artistFrequency[artist] || 0) + 1;
    totalLines += song.lyrics?.length || 0;
  });

  // Find most translated artist
  const mostTranslatedArtist = Object.entries(artistFrequency)
    .sort((a, b) => b[1] - a[1])[0];

  // Time-based stats
  const thisWeekSongs = getSongsInPeriod(songs, 'week');
  const thisMonthSongs = getSongsInPeriod(songs, 'month');

  return {
    totalSongs: songs.length,
    totalLines,
    mostTranslatedArtist: mostTranslatedArtist ? {
      name: mostTranslatedArtist[0],
      count: mostTranslatedArtist[1]
    } : null,
    artistCount: Object.keys(artistFrequency).length,
    thisWeek: thisWeekSongs.length,
    thisMonth: thisMonthSongs.length,
    averageLinesPerSong: Math.round(totalLines / songs.length)
  };
};

// Get activity calendar data (for visualization)
export const getActivityCalendar = (songs, months = 3) => {
  const calendar = {};
  const now = new Date();
  const startDate = new Date();
  startDate.setMonth(now.getMonth() - months);

  // Initialize all dates with 0
  for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().split('T')[0];
    calendar[key] = 0;
  }

  // Count songs per date
  songs.forEach(song => {
    const date = new Date(song.savedAt);
    if (date >= startDate) {
      const key = date.toISOString().split('T')[0];
      calendar[key] = (calendar[key] || 0) + 1;
    }
  });

  return calendar;
};

// Get artist frequency for suggestions
export const getArtistFrequency = (songs) => {
  const frequency = {};

  songs.forEach(song => {
    const artist = song.artist || 'Unknown';
    frequency[artist] = (frequency[artist] || 0) + 1;
  });

  return Object.entries(frequency)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};
