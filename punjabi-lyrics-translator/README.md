# 🎵 Punjabi Lyrics Translator

A modern React-based web application for learning Punjabi through music. Get line-by-line translations of Punjabi songs into Hindi and English with cultural context, pronunciation guides, and intelligent learning features.

## ✨ Features

### Core Functionality
- **Multi-Script Support**: Input lyrics in Gurmukhi (ਪੰਜਾਬੀ), Hindi script (पंजाबी), or English transliteration
- **Dual Translation**: Get accurate Hindi and English translations for each line
- **Auto Lyrics Fetch**: Automatically fetch lyrics using song name and artist (via lyrics.ovh API)
- **Manual Entry**: Enter lyrics manually when automatic fetching isn't available

### Advanced Learning Features
- **Cultural Context Panel**: Understand idioms, metaphors, regional slang, and cultural references
- **Pronunciation Guide**: English transliteration for lyrics in Gurmukhi or Hindi script
- **Cross-References**: Discover similar phrases across your saved songs
- **Timeline & Stats**: Track your learning progress with detailed statistics
- **Smart Suggestions**: Get personalized artist and song recommendations based on your library

### Library Management
- **Search & Filter**: Find songs by name, artist, or date
- **Export/Import**: Backup your translations as JSON
- **Persistent Storage**: All translations saved locally in your browser
- **Delete with Confirmation**: Safely manage your song collection

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd punjabi-lyrics-translator
```

2. Install dependencies:
```bash
npm install
```

3. **Configure API Key** (Required for translations):
```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your Claude API key
# CLAUDE_API_KEY=sk-ant-your-actual-key-here
```

Get your API key from [Anthropic Console](https://console.anthropic.com/settings/keys)

4. **Start both servers** (backend proxy + frontend):
```bash
npm start
```

This will start:
- Backend proxy server on `http://localhost:3001`
- Frontend dev server on `http://localhost:5173`

Or run them separately:
```bash
# Terminal 1: Start backend proxy
npm run server

# Terminal 2: Start frontend
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🎯 How to Use

### Translating Songs

1. **Auto Fetch Method**:
   - Enter the song name and artist name
   - Click "Fetch Lyrics" to automatically retrieve lyrics
   - Review the fetched lyrics
   - Click "Translate" to get translations

2. **Manual Entry Method**:
   - Enter the song name and artist name
   - Paste or type the lyrics in any script (Gurmukhi, Hindi, or English transliteration)
   - Click "Translate"

### Viewing Translations

- **Original Line**: See the lyrics exactly as you entered them
- **Hindi Translation**: Understand the meaning in Hindi
- **English Translation**: Get the English interpretation
- **Cultural Context**: Click "Show Context" on any line to see:
  - Explanation of idioms and metaphors
  - Cultural and historical references
  - Pronunciation guide

### Managing Your Library

- **Search**: Use the search bar to find songs by name or artist
- **Filter**: Filter by specific artists
- **Sort**: Sort by date, song name, or artist name
- **View**: Click on any saved song to see its full translation
- **Delete**: Remove songs you no longer need (with confirmation)

### Tracking Progress

- **Timeline View**: See all songs organized by date
- **Statistics**: View total songs, lines translated, and activity trends
- **Top Artists**: Discover which artists you've translated most
- **Common Themes**: Identify recurring words and concepts in your translations

### Getting Recommendations

- **Artist Suggestions**: Based on your most-translated artists
- **Theme-Based Recommendations**: Suggestions matching your interests
- **Learning Journey**: Track your progress and achievements

## 🔧 Configuration

### API Keys

The application uses the Claude API for translations. When running in Claude's artifact environment, no API key is needed. For standalone deployment:

1. Get an API key from [Anthropic](https://anthropic.com)
2. The app will prompt you to enter it when needed
3. Your API key is stored only in your browser's memory (never saved)

### Lyrics API

Default: `https://api.lyrics.ovh/v1`

You can configure alternative lyrics APIs if needed. The API should return lyrics in JSON format with a `lyrics` field.

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

All modern browsers with LocalStorage support.

## 🎨 Technology Stack

- **Frontend**: React 19 with Hooks
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite
- **Translation API**: Anthropic Claude (Sonnet 4)
- **Lyrics API**: lyrics.ovh (configurable)
- **Storage**: LocalStorage API

## 📋 Project Structure

```
punjabi-lyrics-translator/
├── src/
│   ├── components/          # React components
│   │   ├── LyricsInput.jsx
│   │   ├── TranslationDisplay.jsx
│   │   ├── Library.jsx
│   │   ├── Timeline.jsx
│   │   ├── Suggestions.jsx
│   │   └── Navigation.jsx
│   ├── context/             # React Context for state management
│   │   └── AppContext.jsx
│   ├── services/            # API services
│   │   ├── translationService.js
│   │   └── lyricsService.js
│   ├── utils/               # Utility functions
│   │   ├── storage.js
│   │   ├── crossReference.js
│   │   └── stats.js
│   ├── App.jsx              # Main app component
│   └── index.css            # Tailwind imports and custom styles
├── public/
├── package.json
└── README.md
```

## 🌟 Key Features Explained

### Multi-Script Support

The app intelligently handles three different writing systems:
- **Gurmukhi** (ਪੰਜਾਬੀ): Native Punjabi script
- **Hindi/Devanagari** (पंजाबी): For users familiar with Hindi
- **English Transliteration**: For those who speak but can't read Punjabi

All inputs are correctly interpreted as Punjabi, regardless of the script used.

### Cultural Context

Each translation includes:
- **Idiom Explanations**: Understanding figurative language
- **Cultural References**: Context about Punjabi culture, villages, festivals
- **Regional Slang**: Differences between Malwa, Majha, and Doaba regions
- **Historical Context**: References to Punjabi history and personalities

### Cross-References

The app analyzes all your saved songs to find:
- Common phrases used across different songs
- Similar expressions and their variations
- Connections between songs you've translated

### Smart Learning

- Tracks which artists you translate most
- Identifies themes you're interested in (love, friendship, village life, etc.)
- Suggests similar artists based on your preferences
- Shows your learning progress over time

## 🔒 Privacy & Data

- All data is stored locally in your browser
- No data is sent to external servers except for translation requests
- API keys (if used) are kept in browser memory only
- Export your data anytime as JSON

## ⚠️ Important Notes

- **Personal Use Only**: This tool is for educational purposes and personal learning
- **Copyright**: Respect copyright laws when using song lyrics
- **Accuracy**: Translations are AI-generated and may not be perfect
- **Cultural Context**: Some nuances may vary by region and dialect

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📄 License

For personal use only. Not for redistribution or commercial use.

## 🙏 Acknowledgments

- Built with React and Tailwind CSS
- Powered by Anthropic's Claude AI
- Lyrics data from lyrics.ovh
- Font support for multiple scripts

## 📞 Support

For issues or questions, please check the documentation or create an issue in the repository.

---

**Happy Learning! ਸਿੱਖਦੇ ਰਹੋ! 🎵📚**
