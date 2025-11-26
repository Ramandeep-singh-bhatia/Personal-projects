import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { findSimilarSongs } from '../utils/crossReference';

const TranslationLine = ({ line, index, onCopy }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b-2 border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
        {/* Original Punjabi */}
        <div className="script-support">
          <div className="text-sm font-semibold text-gray-500 mb-2">Original</div>
          <div className="text-lg font-medium text-gray-900 leading-relaxed">
            {line.punjabi}
          </div>
        </div>

        {/* Hindi Translation */}
        <div className="script-support">
          <div className="text-sm font-semibold text-gray-500 mb-2">Hindi</div>
          <div className="text-lg text-gray-800 leading-relaxed">
            {line.hindi}
          </div>
        </div>

        {/* English Translation */}
        <div>
          <div className="text-sm font-semibold text-gray-500 mb-2">English</div>
          <div className="text-lg text-gray-800 leading-relaxed">
            {line.english}
          </div>
        </div>

        {/* Context Toggle */}
        <div className="flex items-start">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <span className="text-base">{expanded ? '▼' : '►'}</span>
            {expanded ? 'Hide' : 'Show'} Context
          </button>
        </div>
      </div>

      {/* Expanded Context Panel */}
      {expanded && (
        <div className="bg-orange-50 p-6 border-t-2 border-orange-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cultural Context */}
            <div>
              <h4 className="text-base font-bold text-orange-800 mb-3">
                📖 Cultural Context
              </h4>
              <p className="text-base text-gray-700 leading-relaxed">
                {line.context || 'No additional context available'}
              </p>
            </div>

            {/* Pronunciation */}
            <div>
              <h4 className="text-base font-bold text-orange-800 mb-3">
                🗣️ Pronunciation
              </h4>
              <p className="text-base text-gray-700 italic leading-relaxed">
                {line.pronunciation || line.punjabi}
              </p>
            </div>
          </div>

          {/* Copy Button */}
          <div className="mt-6">
            <button
              onClick={() => onCopy(line)}
              className="text-sm px-5 py-2 bg-white border-2 border-orange-300 text-orange-700 rounded-lg hover:bg-orange-100 font-semibold transition-colors shadow-sm"
            >
              📋 Copy Line
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const TranslationDisplay = ({ songData, onSave, onBack }) => {
  const { savedSongs, saveSong } = useApp();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showCrossReferences, setShowCrossReferences] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      saveSong(songData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      if (onSave) onSave();
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLine = (line) => {
    const text = `${line.punjabi}\nHindi: ${line.hindi}\nEnglish: ${line.english}\nContext: ${line.context}\nPronunciation: ${line.pronunciation}`;
    navigator.clipboard.writeText(text);
  };

  const handlePrint = () => {
    window.print();
  };

  // Find similar songs
  const similarSongs = findSimilarSongs(songData, savedSongs, 2);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-4xl font-bold text-gray-900">
              {songData.songName}
            </h2>
            <p className="text-xl text-gray-600 mt-2">{songData.artist}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-6 md:mt-0">
            <button
              onClick={onBack}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-md"
            >
              🖨️ Print
            </button>
            <button
              onClick={handleSave}
              disabled={saving || saved}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors shadow-md ${
                saved
                  ? 'bg-green-500 text-white'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              } disabled:cursor-not-allowed`}
            >
              {saved ? '✓ Saved!' : saving ? '⏳ Saving...' : '💾 Save to Library'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-8 text-base text-gray-600 pt-4 border-t-2 border-gray-100">
          <span>
            <strong className="text-gray-900">{songData.lyrics?.length || 0}</strong> lines translated
          </span>
          <span>
            <strong className="text-gray-900">4</strong> columns (Original, Hindi, English, Context)
          </span>
        </div>
      </div>

      {/* Translation Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6">
          <h3 className="text-white text-xl font-bold">📝 Line-by-Line Translation</h3>
        </div>

        <div className="divide-y-2 divide-gray-200">
          {songData.lyrics?.map((line, index) => (
            <TranslationLine
              key={index}
              line={line}
              index={index}
              onCopy={handleCopyLine}
            />
          ))}
        </div>
      </div>

      {/* Cross References */}
      {similarSongs.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <button
            onClick={() => setShowCrossReferences(!showCrossReferences)}
            className="flex items-center justify-between w-full text-left group"
          >
            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
              🔗 Similar Expressions Found
            </h3>
            <span className="text-orange-600 text-xl">
              {showCrossReferences ? '▼' : '►'}
            </span>
          </button>

          {showCrossReferences && (
            <div className="mt-6 space-y-4">
              {similarSongs.slice(0, 5).map((match, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-orange-300 transition-colors"
                >
                  <div className="font-bold text-lg text-gray-900">
                    {match.song.songName} - {match.song.artist}
                  </div>
                  <div className="text-base text-gray-600 mt-2">
                    <strong>{match.matchCount}</strong> similar phrase
                    {match.matchCount > 1 ? 's' : ''} found
                  </div>
                  <div className="text-sm text-gray-500 mt-3 bg-white p-3 rounded">
                    <strong>Common phrases:</strong> {match.phrases.slice(0, 3).join(', ')}
                    {match.phrases.length > 3 && '...'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TranslationDisplay;
