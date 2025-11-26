// Lyrics fetching service using lyrics.ovh API
// Users can also configure their own API endpoint

const DEFAULT_LYRICS_API = 'https://api.lyrics.ovh/v1';

export const fetchLyrics = async (artist, songName, customApiUrl = null) => {
  if (!artist || !songName) {
    throw new Error('Artist and song name are required');
  }

  const apiUrl = customApiUrl || DEFAULT_LYRICS_API;
  const url = `${apiUrl}/${encodeURIComponent(artist)}/${encodeURIComponent(songName)}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Lyrics not found for this song. Please try manual entry.');
      }
      throw new Error(`Failed to fetch lyrics: ${response.status}`);
    }

    const data = await response.json();

    if (!data.lyrics) {
      throw new Error('No lyrics found in the response');
    }

    return data.lyrics;
  } catch (error) {
    console.error('Lyrics fetch error:', error);
    throw error;
  }
};

// Alternative API endpoints that users can configure
export const LYRICS_API_OPTIONS = [
  {
    name: 'Lyrics.ovh',
    url: 'https://api.lyrics.ovh/v1',
    format: '{url}/{artist}/{song}'
  },
  // Users can add more APIs here
];

export const testLyricsAPI = async (apiUrl, artist = 'Diljit Dosanjh', song = 'Do You Know') => {
  try {
    await fetchLyrics(artist, song, apiUrl);
    return { success: true, message: 'API connection successful' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
