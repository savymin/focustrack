const SERVER_URL = "http://127.0.0.1:5000";

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed.");
  chrome.idle.setDetectionInterval(60); // 60 seconds idle threshold
});

// Listen for system idle state changes
chrome.idle.onStateChanged.addListener((newState) => {
  // newState can be 'active', 'idle', or 'locked'
  if (newState === 'idle' || newState === 'locked') {
    sendEventToBackend("TAB_HIDDEN", `System state: ${newState}`);
  } else if (newState === 'active') {
    sendEventToBackend("TAB_VISIBLE", "System state: active");
  }
});

// Listen for messages from content.js when user switches tabs away from Meet
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'tabStatusChanged') {
    const eventType = request.status === 'focused' ? 'TAB_VISIBLE' : 'TAB_HIDDEN';
    sendEventToBackend(eventType, "Google Meet tab visibility changed");
  }
});

function sendEventToBackend(eventType, details) {
  chrome.storage.local.get(['student_id'], (result) => {
    const studentId = result.student_id;
    if (!studentId) return;

    fetch(`${SERVER_URL}/api/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: parseInt(studentId),
        event_type: eventType,
        details: details
      })
    }).catch(err => console.error("Failed to send event:", err));
  });
}