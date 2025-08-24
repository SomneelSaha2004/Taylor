import React, { useState, useEffect } from 'react';

function Settings() {
  const [settings, setSettings] = useState({
    privacyMode: 'local',
    selectedModelProvider: 'openRouter',
    apiKeys: {}
  });
  
  // Load settings from Chrome storage
  useEffect(() => {
    chrome.storage.local.get('settings', (data) => {
      if (data.settings) {
        setSettings(data.settings);
      }
    });
  }, []);
  
  // Save settings to Chrome storage
  const saveSettings = () => {
    chrome.storage.local.set({ settings }, () => {
      alert('Settings saved successfully!');
    });
  };
  
  // Update a setting value
  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Update an API key
  const updateApiKey = (provider, value) => {
    setSettings(prev => ({
      ...prev,
      apiKeys: {
        ...prev.apiKeys,
        [provider]: value
      }
    }));
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-md font-medium text-gray-700">Privacy Mode</h3>
          <p className="text-sm text-gray-600 mb-2">
            Choose how your data is processed for generating suggestions.
          </p>
          
          <div className="flex flex-col space-y-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="privacyMode"
                value="local"
                checked={settings.privacyMode === 'local'}
                onChange={() => updateSetting('privacyMode', 'local')}
                className="h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Local Mode</span>
            </label>
            <p className="text-xs text-gray-500 ml-6">
              Use your own API key to call models directly from your browser. Your data never leaves your device.
            </p>
            
            <label className="inline-flex items-center mt-2">
              <input
                type="radio"
                name="privacyMode"
                value="anonymous"
                checked={settings.privacyMode === 'anonymous'}
                onChange={() => updateSetting('privacyMode', 'anonymous')}
                className="h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Anonymous Mode</span>
            </label>
            <p className="text-xs text-gray-500 ml-6">
              Process through our secure backend. No personal data is stored, and content is anonymized before processing.
            </p>
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium text-gray-700">Model Provider</h3>
          <p className="text-sm text-gray-600 mb-2">
            Select which AI model provider to use for generating suggestions.
          </p>
          
          <select
            value={settings.selectedModelProvider}
            onChange={(e) => updateSetting('selectedModelProvider', e.target.value)}
            className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="openRouter">OpenRouter (Llama/Mistral models)</option>
            <option value="together">Together.ai</option>
            <option value="fireworks">Fireworks.ai</option>
            <option value="ollama">Ollama (local)</option>
            <option value="openai">OpenAI</option>
          </select>
          
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700">
              API Key for {settings.selectedModelProvider}
            </label>
            <input
              type="password"
              value={settings.apiKeys[settings.selectedModelProvider] || ''}
              onChange={(e) => updateApiKey(settings.selectedModelProvider, e.target.value)}
              placeholder={`Enter your ${settings.selectedModelProvider} API key`}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <p className="mt-1 text-xs text-gray-500">
              Your API key is stored locally on your device and is never sent to our servers.
            </p>
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium text-gray-700">Data Management</h3>
          
          <button
            onClick={() => {
              if (confirm('Are you sure you want to clear all your data? This cannot be undone.')) {
                chrome.storage.local.clear(() => {
                  alert('All data cleared. The extension will now reload.');
                  window.location.reload();
                });
              }
            }}
            className="mt-2 px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50"
          >
            Clear All Data
          </button>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={saveSettings}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Save Settings
          </button>
        </div>
      </div>
      
      <div className="text-center text-xs text-gray-500">
        <p>Taylor Resume Extension v1.0.0</p>
        <p className="mt-1">Privacy-first resume tailoring assistant</p>
      </div>
    </div>
  );
}

export default Settings;
