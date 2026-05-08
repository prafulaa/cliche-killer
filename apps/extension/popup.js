// Cliché Killer Popup Script

document.addEventListener('DOMContentLoaded', async () => {
  const scanBtn = document.getElementById('scan');
  const scanText = document.getElementById('scan-text');
  const loader = document.getElementById('loader');
  const statusDiv = document.getElementById('status');
  const resultsDiv = document.getElementById('results');
  const clicheList = document.getElementById('cliche-list');
  const healthScore = document.getElementById('health-score');
  const statsDiv = document.getElementById('stats');

  const mainView = document.getElementById('main-view');
  const settingsView = document.getElementById('settings-view');
  const settingsBtn = document.getElementById('settings-btn');
  const backBtn = document.getElementById('back-btn');
  const apiKeyInput = document.getElementById('api-key-input');
  const saveKeyBtn = document.getElementById('save-key');

  // Load existing API Key
  const { apiKey } = await chrome.storage.local.get('apiKey');
  if (apiKey) {
    apiKeyInput.value = apiKey;
  }

  // View Switching
  settingsBtn.onclick = () => {
    mainView.classList.add('hidden');
    settingsView.classList.remove('hidden');
  };

  backBtn.onclick = () => {
    settingsView.classList.add('hidden');
    mainView.classList.remove('hidden');
  };

  // API Key Saving
  saveKeyBtn.onclick = async () => {
    const key = apiKeyInput.value.trim();
    await chrome.storage.local.set({ apiKey: key });
    statusDiv.innerText = 'API Key saved successfully!';
    setTimeout(() => {
      statusDiv.innerText = '';
      backBtn.click();
    }, 1500);
  };

  // Scanning Logic
  scanBtn.onclick = async () => {
    setLoading(true);
    statusDiv.innerText = '';
    resultsDiv.classList.add('hidden');
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) throw new Error('No active tab found');

      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const selection = window.getSelection().toString();
          if (selection) return selection;
          
          const activeEl = document.activeElement;
          if (activeEl && (activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)) {
            return activeEl.value || activeEl.innerText;
          }

          const editors = document.querySelectorAll('textarea, [contenteditable="true"]');
          if (editors.length > 0) return editors[0].value || editors[0].innerText;
          
          return document.body.innerText.substring(0, 5000);
        }
      });

      const text = results[0]?.result;
      if (!text || text.length < 5) {
        throw new Error('No substantial text found to scan.');
      }

      chrome.runtime.sendMessage({ type: 'ANALYZE_TEXT', text }, (response) => {
        setLoading(false);
        if (response.error) {
          statusDiv.innerText = 'Error: ' + response.error;
        } else {
          renderResults(response, tab.id);
        }
      });
    } catch (err) {
      setLoading(false);
      statusDiv.innerText = err.message;
    }
  };

  function setLoading(isLoading) {
    scanBtn.disabled = isLoading;
    if (isLoading) {
      scanText.classList.add('hidden');
      loader.classList.remove('hidden');
    } else {
      scanText.classList.remove('hidden');
      loader.classList.add('hidden');
    }
  }

  function renderResults(data, tabId) {
    resultsDiv.classList.remove('hidden');
    healthScore.innerText = data.healthScore;
    
    // Set score color
    healthScore.className = 'score-value';
    if (data.healthScore > 75) healthScore.classList.add('good');
    else if (data.healthScore > 40) healthScore.classList.add('mid');
    else healthScore.classList.add('bad');

    statsDiv.innerText = `${data.clichesFound} clichés detected`;

    clicheList.innerHTML = '';
    data.clicheList.forEach(c => {
      const li = document.createElement('li');
      li.className = 'cliche-item';
      
      const altsHtml = c.alternatives.slice(0, 3).map(alt => 
        `<span class="alt-tag" data-phrase="${c.phrase}" data-replacement="${alt}">${alt}</span>`
      ).join('');

      li.innerHTML = `
        <div class="cliche-header">
          <div class="cliche-phrase">"${c.phrase}"</div>
          <div class="cliche-meta">Severity: ${c.severity}</div>
        </div>
        <div class="cliche-suggestion">
          ${altsHtml}
        </div>
      `;

      // Add click handlers for each alternative
      li.querySelectorAll('.alt-tag').forEach(tag => {
        tag.onclick = async () => {
          const phrase = tag.dataset.phrase;
          const replacement = tag.dataset.replacement;
          
          try {
            await chrome.tabs.sendMessage(tabId, {
              type: 'REPLACE_TEXT',
              phrase,
              replacement
            });
            tag.innerText = 'Fixed! ✓';
            tag.classList.add('fixed');
            setTimeout(() => {
              tag.style.display = 'none';
            }, 1000);
          } catch (err) {
            console.error('Failed to replace text:', err);
            statusDiv.innerText = 'Could not fix in page automatically.';
          }
        };
      });

      clicheList.appendChild(li);
    });
  }
});
