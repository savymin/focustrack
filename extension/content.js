console.log("Meet Focus Monitor content script active.");

// Track tab focus / visibility
document.addEventListener('visibilitychange', () => {
    const currentStatus = document.visibilityState === 'visible' ? 'focused' : 'unfocused';
    chrome.runtime.sendMessage({
        action: 'tabStatusChanged',
        status: currentStatus
    });
});

// 1. Track Active vs Inactive Time
let isActive = true;
window.addEventListener('focus', () => { isActive = true; });
window.addEventListener('blur', () => { isActive = false; });

setInterval(() => {
    if (document.visibilityState === 'visible' && isActive) {
        chrome.runtime.sendMessage({ action: "increment_active", time: 1 });
    } else {
        chrome.runtime.sendMessage({ action: "increment_inactive", time: 1 });
    }
}, 1000);

// 2. Track Camera and Microphone State Changes & Send Messages
let lastMicState = null;
let lastCamState = null;

const observer = new MutationObserver(() => {
    // Check Microphone button
    const micButton = document.querySelector('button[aria-label*="microphone" i], button[aria-label*="mic" i]');
    if (micButton) {
        const ariaLabel = micButton.getAttribute('aria-label') || '';
        // If label includes "Turn on", mic is currently muted/off
        const isMuted = ariaLabel.toLowerCase().includes('turn on');
        
        if (isMuted !== lastMicState) {
            lastMicState = isMuted;
            chrome.runtime.sendMessage({
                action: 'micEvent',
                status: isMuted ? 'off' : 'on'
            });
        }
    }

    // Check Camera button
    const camButton = document.querySelector('button[aria-label*="camera" i], button[aria-label*="cam" i]');
    if (camButton) {
        const ariaLabel = camButton.getAttribute('aria-label') || '';
        const isCamOff = ariaLabel.toLowerCase().includes('turn on');

        if (isCamOff !== lastCamState) {
            lastCamState = isCamOff;
            chrome.runtime.sendMessage({
                action: 'cameraEvent',
                status: isCamOff ? 'off' : 'on'
            });
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-label'] });