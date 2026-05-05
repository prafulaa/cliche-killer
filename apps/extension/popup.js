// Cliché Killer Popup Script

document.addEventListener('DOMContentLoaded', () => {
  const scanBtn = document.getElementById('scan');
  const statusDiv = document.createElement('div');
  statusDiv.id = 'status';
  document.body.appendChild(statusDiv);

  scanBtn.onclick = async () => {
    statusDiv.innerText = 'Scanning...';
    
    // Get text from active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const selection = window.getSelection().toString();
        if (selection) return selection;
        
        // Fallback to searching all textareas
        const editors = document.querySelectorAll('textarea, [contenteditable="true"]');
        if (editors.length > 0) return editors[0].value || editors[0].innerText;
        
        return document.body.innerText;
      }
    }, async (results) => {
      const text = results[0].result;
      if (!text) {
        statusDiv.innerText = 'No text found to scan.';
        return;
      }

      chrome.runtime.sendMessage({ type: 'ANALYZE_TEXT', text }, (response) => {
        if (response.error) {
          statusDiv.innerText = 'Error: ' + response.error;
        } else {
          renderResults(response);
        }
      });
    });
  };

  function renderResults(data) {
    statusDiv.innerHTML = `
      <div style="margin-top: 1rem; border-top: 1px solid #eee; padding-top: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <strong>Health Score:</strong>
          <span style="color: ${data.healthScore > 70 ? 'green' : 'red'}; font-size: 1.2rem; font-weight: bold;">
            ${data.healthScore}
          </span>
        </div>
        <p style="font-size: 0.8rem; color: #666;">${data.clichesFound} clichés detected.</p>
        <ul style="list-style: none; padding: 0; margin: 1rem 0; max-height: 200px; overflow-y: auto;">
          ${data.clicheList.slice(0, 5).map(c => `
            <li style="margin-bottom: 0.5rem; padding: 0.5rem; background: #fff5f5; border-radius: 4px; border-left: 3px solid #e11d48;">
              <div style="font-weight: bold; font-size: 0.8rem; color: #e11d48;">"${c.phrase}"</div>
              <div style="font-size: 0.7rem; color: #666; margin-top: 0.2rem;">Try: ${c.alternatives.join(', ')}</div>
            </li>
          `).join('')}
        </ul>
        ${data.clicheList.length > 5 ? `<p style="font-size: 0.7rem; color: #999;">And ${data.clicheList.length - 5} more...</p>` : ''}
        <a href="http://localhost:3000/analyze" target="_blank" style="display: block; text-align: center; font-size: 0.8rem; color: #e11d48; text-decoration: none; margin-top: 1rem;">Open Full Editor</a>
      </div>
    `;
  }
});
