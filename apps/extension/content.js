// Cliché Killer Content Script

// Function to find active text areas
function injectIconIntoEditors() {
  const editors = document.querySelectorAll('textarea, [contenteditable="true"]');
  
  editors.forEach(editor => {
    if (editor.dataset.clicheKillerInjected) return;
    
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
    btn.innerHTML = '👻';
    btn.title = 'Scan for clichés';
    btn.style.cssText = `
      position: absolute;
      z-index: 2147483647;
      cursor: pointer;
      font-size: 18px;
      background: linear-gradient(135deg, #e11d48 0%, #fb7185 100%);
      border-radius: 50%;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(225, 29, 72, 0.4);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      user-select: none;
    `;
    
    btn.onmouseover = () => {
      btn.style.transform = 'scale(1.1)';
      btn.style.boxShadow = '0 6px 16px rgba(225, 29, 72, 0.5)';
    };
    
    btn.onmouseout = () => {
      btn.style.transform = 'scale(1)';
      btn.style.boxShadow = '0 4px 12px rgba(225, 29, 72, 0.4)';
    };

    document.body.appendChild(btn);
    
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const text = editor.value || editor.innerText;
      btn.innerHTML = '⏳';
      
      chrome.runtime.sendMessage({ type: 'ANALYZE_TEXT', text }, (response) => {
        btn.innerHTML = '👻';
        if (response.error) {
          console.error('Cliché Killer Error:', response.error);
        } else {
          // For now, we rely on the user opening the popup to see results
          // but we could show a small toast here
          showToast(`${response.clichesFound} clichés found! Open extension to fix.`);
        }
      });
    };
  }

  const updatePosition = () => {
    const rect = editor.getBoundingClientRect();
    if (rect.width === 0) {
      btn.style.display = 'none';
      return;
    }
    btn.style.top = `${window.scrollY + rect.top + 5}px`;
    btn.style.left = `${window.scrollX + rect.right - 35}px`;
    btn.style.display = 'flex';
  };

  updatePosition();
  // Update on scroll/resize
  window.addEventListener('scroll', updatePosition, { passive: true });
  window.addEventListener('resize', updatePosition, { passive: true });
}

function showToast(msg) {
  let toast = document.getElementById('cliche-killer-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cliche-killer-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #18181b;
      color: white;
      padding: 12px 20px;
      border-radius: 10px;
      font-family: sans-serif;
      font-size: 14px;
      z-index: 2147483647;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      border: 1px solid rgba(255,255,255,0.1);
      transform: translateY(100px);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    document.body.appendChild(toast);
  }
  toast.innerText = msg;
  toast.style.transform = 'translateY(0)';
  setTimeout(() => {
    toast.style.transform = 'translateY(150px)';
  }, 3000);
}

// Handle text replacement
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'REPLACE_TEXT') {
    const { phrase, replacement } = message;
    const replaced = replaceInPage(phrase, replacement);
    sendResponse({ success: replaced });
  }
});

function replaceInPage(phrase, replacement) {
  const activeEl = document.activeElement;
  
  if (activeEl && (activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'INPUT')) {
    const start = activeEl.selectionStart;
    const end = activeEl.selectionEnd;
    const val = activeEl.value;
    
    // Try to find the phrase in the whole text if not selected
    const regex = new RegExp(escapeRegExp(phrase), 'gi');
    if (val.match(regex)) {
      activeEl.value = val.replace(regex, replacement);
      activeEl.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    }
  } else if (activeEl && activeEl.isContentEditable) {
    const html = activeEl.innerHTML;
    const regex = new RegExp(escapeRegExp(phrase), 'gi');
    if (html.match(regex)) {
      activeEl.innerHTML = html.replace(regex, replacement);
      activeEl.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    }
  }
  
  // Fallback: search all editable elements
  const editors = document.querySelectorAll('textarea, [contenteditable="true"]');
  for (const editor of editors) {
    const content = editor.value || editor.innerHTML;
    const regex = new RegExp(escapeRegExp(phrase), 'gi');
    if (content.match(regex)) {
      if (editor.value !== undefined) {
        editor.value = editor.value.replace(regex, replacement);
      } else {
        editor.innerHTML = editor.innerHTML.replace(regex, replacement);
      }
      editor.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    }
  }
  
  return false;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Watch for DOM changes
const observer = new MutationObserver(injectIconIntoEditors);
observer.observe(document.body, { childList: true, subtree: true });

injectIconIntoEditors();
