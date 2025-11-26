// Claude API service for translating Punjabi lyrics

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

export const translateLyrics = async (lyrics, apiKey) => {
  if (!lyrics || !lyrics.trim()) {
    throw new Error('Lyrics are required');
  }

  const prompt = `Translate the following Punjabi song lyrics line by line into Hindi and English.
The lyrics may be written in Gurmukhi script, Hindi script, or English transliteration, but they should always be interpreted as Punjabi.
Maintain poetic tone and explain any colloquial or regional expressions.

For each line, provide:
1. Hindi translation
2. English translation
3. Cultural context (explain idioms, metaphors, cultural references, regional slang)
4. Pronunciation guide in English transliteration (if the original is in Gurmukhi or Hindi script)

Respond in JSON using this structure:
{
  "translations": [
    {
      "punjabi": "original line",
      "hindi": "hindi translation",
      "english": "english translation",
      "context": "Cultural context, idioms, metaphors explanation",
      "pronunciation": "english transliteration for pronunciation"
    }
  ]
}

Punjabi Lyrics:
${lyrics}`;

  try {
    const headers = {
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    };

    // Only add API key if provided (for artifact environment, it's not needed)
    if (apiKey) {
      headers['x-api-key'] = apiKey;
    }

    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message ||
        `API request failed with status ${response.status}`
      );
    }

    const data = await response.json();
    const contentText = data.content[0].text;

    // Extract JSON from the response
    const jsonMatch = contentText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse translation response');
    }

    const translationData = JSON.parse(jsonMatch[0]);

    if (!translationData.translations || !Array.isArray(translationData.translations)) {
      throw new Error('Invalid translation format received');
    }

    return translationData.translations;
  } catch (error) {
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
