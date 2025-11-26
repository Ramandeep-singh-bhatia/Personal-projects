import { useState } from 'react';
import { useApp } from '../context/AppContext';

const Settings = () => {
  const { apiKey, setApiKey, lyricsApiUrl, setLyricsApiUrl } = useApp();
  const [localApiKey, setLocalApiKey] = useState(apiKey || '');
  const [localLyricsApi, setLocalLyricsApi] = useState(lyricsApiUrl);
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    setApiKey(localApiKey);
    setLyricsApiUrl(localLyricsApi);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>

        {/* Claude API Key */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Claude API Key *
          </label>
          <div className="flex gap-2">
            <input
              type={showKey ? 'text' : 'password'}
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
              placeholder="sk-ant-..."
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              {showKey ? '🙈 Hide' : '👁️ Show'}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Get your API key from{' '}
            <a
              href="https://console.anthropic.com/settings/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:text-orange-700 underline"
            >
              Anthropic Console
            </a>
          </p>
        </div>

        {/* Lyrics API URL */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lyrics API URL
          </label>
          <input
            type="text"
            value={localLyricsApi}
            onChange={(e) => setLocalLyricsApi(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="https://api.lyrics.ovh/v1"
          />
          <p className="text-sm text-gray-500 mt-2">
            Default: https://api.lyrics.ovh/v1
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Important Notes</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Your API key is stored only in your browser (not on any server)</li>
            <li>• The API key is required for translation functionality</li>
            <li>• Lyrics auto-fetch may not work for all songs</li>
            <li>• You can always enter lyrics manually</li>
          </ul>
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            {saved ? '✓ Saved!' : 'Save Settings'}
          </button>
        </div>

        {/* Current Status */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Current Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Claude API:</span>
              <span className={`font-medium ${apiKey ? 'text-green-600' : 'text-red-600'}`}>
                {apiKey ? '✓ Configured' : '✗ Not configured'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Lyrics API:</span>
              <span className="font-medium text-green-600">
                ✓ {lyricsApiUrl}
              </span>
            </div>
          </div>
        </div>

        {/* Warning if API key not set */}
        {!apiKey && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Translation won't work without an API key.</strong> Please add your Claude API key above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
