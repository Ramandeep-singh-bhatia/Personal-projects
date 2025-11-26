// Claude API service for translating Punjabi lyrics
// Uses local proxy server to avoid CORS issues

const PROXY_URL = 'http://localhost:3001/api/translate';

export const translateLyrics = async (lyrics, apiKey) => {
  if (!lyrics || !lyrics.trim()) {
    throw new Error('Lyrics are required');
  }

  try {
    const response = await fetch(PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ lyrics })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error ||
        `API request failed with status ${response.status}`
      );
    }

    const data = await response.json();

    if (!data.translations || !Array.isArray(data.translations)) {
      throw new Error('Invalid translation format received');
    }

    return data.translations;
  } catch (error) {
    // Check if it's a network error (proxy not running)
    if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
      throw new Error('Could not connect to translation server. Make sure the backend server is running (npm run server)');
    }
    console.error('Translation error:', error);
    throw error;
  }
};

// Test function to validate the service
export const testTranslation = async (apiKey) => {
  const testLyrics = "ਤੇਰੇ ਨਾਲ ਪਿਆਰ ਹੋ ਗਿਆ";
  try {
    await translateLyrics(testLyrics, apiKey);
    return { success: true, message: 'API connection successful' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
