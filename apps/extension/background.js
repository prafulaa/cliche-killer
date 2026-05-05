// Cliché Killer Background Script

const API_URL = 'http://localhost:3001'; // Should be configurable in settings

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ANALYZE_TEXT') {
    analyzeText(message.text)
      .then(data => sendResponse(data))
      .catch(err => sendResponse({ error: err.message }));
    return true; // Keep channel open for async response
  }
});

async function analyzeText(text) {
  // Get API key from storage
  const { apiKey } = await chrome.storage.local.get('apiKey');
  
  const headers = { 'Content-Type': 'application/json' };
  if (apiKey) {
    headers['X-API-Key'] = apiKey; // Use API key if available
  }

  const response = await fetch(`${API_URL}/api/analyze`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ text })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to analyze');
  }

  return await response.json();
}
