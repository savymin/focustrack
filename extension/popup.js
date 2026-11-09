document.addEventListener('DOMContentLoaded', () => {
  const sessionIdInput = document.getElementById('sessionId');
  const studentNameInput = document.getElementById('studentName');
  const saveBtn = document.getElementById('saveBtn');
  const statusDiv = document.getElementById('status');

  // Load saved values
  chrome.storage.local.get(['session_id', 'student_name', 'student_id'], (data) => {
    if (data.session_id) sessionIdInput.value = data.session_id;
    if (data.student_name) studentNameInput.value = data.student_name;
    if (data.student_id) {
      statusDiv.textContent = "Status: Connected & Monitoring";
      statusDiv.style.backgroundColor = "#e6f4ea";
      statusDiv.style.color = "#137333";
    }
  });

  saveBtn.addEventListener('click', async () => {
    const sessionId = sessionIdInput.value.trim();
    const studentName = studentNameInput.value.trim();

    if (!sessionId || !studentName) {
      alert("Please enter session ID and your name.");
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:5000/api/student/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: parseInt(sessionId), student_name: studentName })
      });
      const data = await res.json();

      if (res.ok) {
        chrome.storage.local.set({
          session_id: sessionId,
          student_name: studentName,
          student_id: data.student_id
        }, () => {
          statusDiv.textContent = "Status: Connected & Monitoring";
          statusDiv.style.backgroundColor = "#e6f4ea";
          statusDiv.style.color = "#137333";
          alert("Successfully registered with the server!");
        });
      } else {
        alert(data.error || "Failed to register.");
      }
    } catch (err) {
      alert("Could not connect to Flask server at http://127.0.0.1:5000");
    }
  });
});