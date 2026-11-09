console.log("Meet Focus Monitor content script active.");

document.addEventListener('visibilitychange', () => {
  const currentStatus = document.visibilityState === 'visible' ? 'focused' : 'unfocused';
  
  chrome.runtime.sendMessage({
    action: 'tabStatusChanged',
    status: currentStatus
  });
});