import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { findSimilarSongs } from '../utils/crossReference';

const TranslationLine = ({ line, index, onCopy }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        {/* Original Punjabi */}
        <div className="script-support">
          <div className="text-xs text-gray-500 mb-1">Original</div>
          <div className="text-base font-medium text-gray-900">
            {line.punjabi}
          </div>
        </div>

        {/* Hindi Translation */}
        <div className="script-support">
          <div className="text-xs text-gray-500 mb-1">Hindi</div>
          <div className="text-base text-gray-800">
            {line.hindi}
          </div>
        </div>

        {/* English Translation */}
        <div>
          <div className="text-xs text-gray-500 mb-1">English</div>
          <div className="text-base text-gray-800">
            {line.english}
          </div>
        </div>

        {/* Context Toggle */}
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
          >
            <span>{expanded ? '▼' : '►'}</span>
            {expanded ? 'Hide' : 'Show'} Context
          </button>
        </div>
      </div>

      {/* Expanded Context Panel */}
      {expanded && (
        <div className="bg-orange-50 p-4 border-t border-orange-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cultural Context */}
            <div>
              <h4 className="text-sm font-semibold text-orange-800 mb-2">
                Cultural Context
              </h4>
              <p className="text-sm text-gray-700">
                {line.context || 'No additional context available'}
              </p>
            </div>

            {/* Pronunciation */}
            <div>
              <h4 className="text-sm font-semibold text-orange-800 mb-2">
                Pronunciation
              </h4>
              <p className="text-sm text-gray-700 italic">
                {line.pronunciation || line.punjabi}
              </p>
            </div>
          </div>

          {/* Copy Button */}
          <div className="mt-3">
            <button
              onClick={() => onCopy(line)}
              className="text-xs px-3 py-1 bg-white border border-orange-300 text-orange-700 rounded hover:bg-orange-100 transition-colors"
            >
              Copy Line
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
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {songData.songName}
            </h2>
            <p className="text-lg text-gray-600 mt-1">{songData.artist}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Print
            </button>
            <button
              onClick={handleSave}
              disabled={saving || saved}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                saved
                  ? 'bg-green-500 text-white'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              } disabled:cursor-not-allowed`}
            >
              {saved ? '✓ Saved' : saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 text-sm text-gray-600">
          <span>
            <strong>{songData.lyrics?.length || 0}</strong> lines
          </span>
          <span>
            <strong>4</strong> columns (Original, Hindi, English, Context)
          </span>
        </div>
      </div>

      {/* Translation Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4">
          <h3 className="text-white font-semibold">Line-by-Line Translation</h3>
        </div>

        <div className="divide-y divide-gray-200">
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
        <div className="bg-white rounded-lg shadow-lg p-6">
          <button
            onClick={() => setShowCrossReferences(!showCrossReferences)}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-xl font-semibold text-gray-900">
              Similar Expressions Found
            </h3>
            <span className="text-orange-600">
              {showCrossReferences ? '▼' : '►'}
            </span>
          </button>

          {showCrossReferences && (
            <div className="mt-4 space-y-3">
              {similarSongs.slice(0, 5).map((match, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="font-medium text-gray-900">
                    {match.song.songName} - {match.song.artist}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {match.matchCount} similar phrase
                    {match.matchCount > 1 ? 's' : ''} found
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Common phrases: {match.phrases.slice(0, 3).join(', ')}
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
