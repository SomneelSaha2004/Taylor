# Development Instructions

This document provides instructions on setting up and developing the Taylor Resume Extension.

## Project Structure

```
taylor-resume-extension/
├── icons/                   # Extension icons
├── src/
│   ├── background/          # Background service worker
│   ├── components/          # React components
│   ├── content/             # Content scripts
│   └── utils/               # Utility functions
├── index.html               # Popup HTML entry point
├── manifest.json            # Chrome extension manifest
├── package.json             # Project dependencies
├── vite.config.js           # Vite configuration
└── tailwind.config.js       # Tailwind CSS configuration
```

## Setup Instructions

1. Clone this repository
2. Install dependencies:

```bash
cd taylor-resume-extension
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. To build the extension for production:

```bash
./build.sh
```

## Loading the Extension in Chrome

1. Build the extension with the build script
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `dist` folder from the project directory

## Adding Backend (Optional)

To add a backend server:

1. Create a new FastAPI or Express project in a separate directory
2. Implement the following endpoints:
   - `/suggest` - For tailoring resume suggestions
   - `/cover-letter` - For generating cover letters
3. Update the extension's background script to call your backend API

## Future Improvements

- Implement proper PDF and DOCX parsing
- Add better NLP-based resume section detection
- Add proper resume formatting and tailoring metrics
- Implement analytics to track which suggestions are most helpful
- Add a user account system for storing multiple resumes and job descriptions
- Implement document export in multiple formats
