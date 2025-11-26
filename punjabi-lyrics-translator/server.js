// Simple Express server to proxy Claude API requests
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/translate', async (req, res) => {
  const { lyrics } = req.body;

  if (!lyrics) {
    return res.status(400).json({ error: 'Lyrics are required' });
  }

  if (!process.env.CLAUDE_API_KEY) {
    return res.status(500).json({ error: 'CLAUDE_API_KEY not configured in .env file' });
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
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
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
      const errorData = await response.json();
      return res.status(response.status).json({
        error: errorData.error?.message || 'Translation failed'
      });
    }

    const data = await response.json();
    const contentText = data.content[0].text;

    // Extract JSON from response
    const jsonMatch = contentText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: 'Could not parse translation response' });
    }

    const translationData = JSON.parse(jsonMatch[0]);
    res.json(translationData);

  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server running on http://localhost:${PORT}`);
  console.log(`📝 Frontend should connect to: http://localhost:${PORT}/api/translate`);
});
