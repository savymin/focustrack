# FocusTrack - Google Meet Student Focus Monitor

A Chrome Extension (Manifest V3) and Flask backend system designed to monitor student tab focus and AV toggles during Google Meet sessions.

## Quick Start Instructions

### 1. Prerequisites
- Python 3.8+
- Google Chrome Browser

### 2. Backend Setup & Run
1. Navigate to the project root directory:
   cd class_monitor_group5
2. Install dependencies:
   pip install -r requirements.txt
3. Ensure your `credentials.json` (Google OAuth) is placed in the root folder.
4. Start the Flask server:
   python app.py
   (Server will run on http://127.0.0.1:5000)

### 3. Load Chrome Extension
1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked** and select the `extension` folder inside this repository.

### 4. How to Use
1. Open `http://127.0.0.1:5000` in your browser.
2. Connect your Google account and click **Start Session** to generate a Session ID.
3. Open a Google Meet call (`https://meet.google.com/...`).
4. Click the FocusTrack extension icon, enter the **Session ID** and your name, then click **Register & Connect**.