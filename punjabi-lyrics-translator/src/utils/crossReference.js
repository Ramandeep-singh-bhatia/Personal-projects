// Utility functions for finding similar phrases across songs

// Simple word tokenization and normalization
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .trim();
};

// Extract key phrases (2-4 word combinations)
const extractPhrases = (text) => {
  const words = normalizeText(text).split(/\s+/);
  const phrases = [];

  // 2-word phrases
  for (let i = 0; i < words.length - 1; i++) {
    phrases.push(words.slice(i, i + 2).join(' '));
  }

  // 3-word phrases
  for (let i = 0; i < words.length - 2; i++) {
    phrases.push(words.slice(i, i + 3).join(' '));
  }

  return phrases;
};

// Find songs with similar phrases
export const findSimilarSongs = (currentSong, allSongs, minMatchCount = 2) => {
  if (!currentSong || !allSongs || allSongs.length === 0) {
    return [];
  }

  // Get all phrases from current song
  const currentPhrases = new Set();
  currentSong.lyrics?.forEach(line => {
    if (line.punjabi) {
      extractPhrases(line.punjabi).forEach(phrase => currentPhrases.add(phrase));
    }
  });

  // Find matches in other songs
  const matches = [];

  allSongs.forEach(song => {
    // Skip the current song
    if (song.id === currentSong.id) return;

    const matchedPhrases = new Set();
    song.lyrics?.forEach(line => {
      if (line.punjabi) {
        extractPhrases(line.punjabi).forEach(phrase => {
          if (currentPhrases.has(phrase)) {
            matchedPhrases.add(phrase);
          }
        });
      }
    });

    if (matchedPhrases.size >= minMatchCount) {
      matches.push({
        song,
        matchCount: matchedPhrases.size,
        phrases: Array.from(matchedPhrases)
      });
    }
  });

  // Sort by match count (highest first)
  return matches.sort((a, b) => b.matchCount - a.matchCount);
};

// Find which saved songs contain a specific phrase
export const findSongsWithPhrase = (phrase, allSongs) => {
  const normalizedPhrase = normalizeText(phrase);
  const matches = [];

  allSongs.forEach(song => {
    song.lyrics?.forEach((line, lineIndex) => {
      if (line.punjabi && normalizeText(line.punjabi).includes(normalizedPhrase)) {
        matches.push({
          song,
          lineIndex,
          line
        });
      }
    });
  });

  return matches;
};

// Extract common themes/keywords from a collection of songs
export const extractCommonThemes = (songs) => {
  const wordFrequency = {};

  // Common Punjabi words to filter out (stop words)
  const stopWords = new Set([
    'te', 'di', 'da', 'de', 'nu', 'ne', 'hai', 'hoon', 'si', 'ho', 'ke',
    'tera', 'mera', 'ਤੇ', 'ਦੀ', 'ਦਾ', 'ਦੇ', 'ਨੂੰ', 'ਨੇ', 'ਹੈ'
  ]);

  songs.forEach(song => {
    song.lyrics?.forEach(line => {
      if (line.punjabi) {
        const words = normalizeText(line.punjabi).split(/\s+/);
        words.forEach(word => {
          if (word.length > 2 && !stopWords.has(word)) {
            wordFrequency[word] = (wordFrequency[word] || 0) + 1;
          }
        });
      }
    });
  });

  // Convert to array and sort by frequency
  const themes = Object.entries(wordFrequency)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 themes

  return themes;
};
