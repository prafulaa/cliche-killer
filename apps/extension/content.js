// Cliché Killer Content Script

console.log('Cliché Killer: Content script loaded');

// Function to find active text areas
function injectIconIntoEditors() {
  const editors = document.querySelectorAll('textarea, [contenteditable="true"]');
  
  editors.forEach(editor => {
    if (editor.dataset.clicheKillerInjected) return;
    
    // Simple injection logic: find a parent with relative positioning or create a wrapper
    // For now, we'll just listen for focus and show a floating button
    editor.addEventListener('focus', () => {
      showFloatingButton(editor);
    });
    
    editor.dataset.clicheKillerInjected = 'true';
  });
}

function showFloatingButton(editor) {
  let btn = document.getElementById('cliche-killer-btn');
  if (!btn) {
    btn = document.createElement('div');
    btn.id = 'cliche-killer-btn';
    btn.innerHTML = '👻'; // Ghost icon
    btn.style.cssText = `
      position: absolute;
      z-index: 10000;
      cursor: pointer;
      font-size: 20px;
      background: #e11d48;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(225, 29, 72, 0.3);
      transition: transform 0.2s;
    `;
    document.body.appendChild(btn);
    
    btn.onclick = () => {
      const text = editor.value || editor.innerText;
      chrome.runtime.sendMessage({ type: 'ANALYZE_TEXT', text }, (response) => {
        if (response.error) {
          alert('Error: ' + response.error);
        } else {
          console.log('Analysis:', response);
          // In a real version, we'd open a local iframe or modal
          // For MVP, we send a message to the popup
          chrome.runtime.sendMessage({ type: 'SHOW_RESULTS', data: response });
        }
      });
    };
  }

  const rect = editor.getBoundingClientRect();
  btn.style.top = `${window.scrollY + rect.top + 5}px`;
  btn.style.left = `${window.scrollX + rect.right - 40}px`;
  btn.style.display = 'flex';
}

// Watch for DOM changes to handle dynamic editors (like in Gmail)
const observer = new MutationObserver(injectIconIntoEditors);
observer.observe(document.body, { childList: true, subtree: true });

injectIconIntoEditors();
