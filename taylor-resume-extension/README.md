# Taylor Resume Tailoring Extension

A Chrome MV3 extension that helps users tailor their resumes and draft cover letters based on job descriptions. Taylor makes your job applications more effective by adapting your resume to each specific job and generating customized cover letters.


## Table of Contents
- [Installation Guide](#installation-guide)
- [Complete User Guide](#complete-user-guide)
  - [First-Time Setup](#first-time-setup)
  - [Using on Job Sites](#using-on-job-sites)
  - [Tailoring Your Resume](#tailoring-your-resume)
  - [Generating Cover Letters](#generating-cover-letters)
  - [Managing Settings](#managing-settings)
- [Troubleshooting](#troubleshooting)
- [Privacy & Security](#privacy--security)
- [FAQs](#frequently-asked-questions)
- [Development & Contribution](#development--contribution)

## Installation Guide

### Method : Manual Installation (Developer Mode)

#### Prerequisites
- Google Chrome or any Chromium-based browser (Edge, Brave, etc.)
- The extension files (download from releases or build from source)

#### Installation Steps
1. Download and extract the extension files to a folder on your computer
2. Open your browser and navigate to the extensions page:
   - **Chrome**: `chrome://extensions/`
   - **Edge**: `edge://extensions/`
   - **Brave**: `brave://extensions/`
3. Enable "Developer mode" using the toggle switch in the top-right corner
4. Click "Load unpacked" button that appears
5. Select the `dist` folder containing the extension files
6. The Taylor icon should now appear in your browser's extension toolbar

## Complete User Guide

### First-Time Setup

1. **Access the Extension**
   - Click the Taylor "T" icon in your browser's extension toolbar
   - If you don't see it, click the puzzle piece icon and pin Taylor for easy access

2. **Upload Your Resume**
   - On first run, you'll see the resume upload screen
   - Click "Upload" to select your resume file (PDF or DOCX format)
   - Alternatively, paste your resume text directly into the text field
   - The extension will attempt to parse your resume automatically

3. **Verify Resume Sections**
   - Review how your resume was parsed into different sections
   - Edit any sections that weren't correctly identified
   - Fill in your:
     - Personal Information (name, email, phone, location)
     - Professional Summary
     - Skills (comma-separated)
     - Work Experience (with bullet points for each role)
     - Education
     - Projects (optional)
   - Click "Save Resume" when complete

### Using on Job Sites

1. **Find a Job Description**
   - Browse to any job listing site (LinkedIn, Indeed, company career pages, etc.)

2. **Capture the Job Description**
   - Method A: Highlight the entire job description with your cursor
   - Method B: The extension will attempt to automatically detect job descriptions on popular job sites

3. **Open the Extension**
   - Click the Taylor "T" icon in your browser toolbar
   - The extension will open with the captured job description

4. **Review the Job Description**
   - Verify that the correct text was captured
   - Edit the text if needed by clicking "Edit"
   - The extension will automatically extract key information (job title, company, etc.)

### Tailoring Your Resume

1. **Navigate to the Tailor Tab**
   - Click the "Tailor Resume" tab in the extension popup

2. **Generate Suggestions**
   - Click "Generate Tailored Resume Suggestions"
   - The AI will analyze both your resume and the job description
   - This may take 15-30 seconds depending on your settings

3. **Review Suggestions**
   - See key skills extracted from the job description
   - View which of your experiences are most relevant (on a 0-3 scale)
   - Read why each experience is relevant to the job

4. **Apply Suggestions**
   - For each experience, you'll see suggested rewrites of your bullet points
   - Click the "+" icon to add a suggestion to your resume
   - Click the copy icon to copy a suggestion to your clipboard
   - Use the tabs to navigate between different work experiences

5. **Add Suggested Skills**
   - Click "Add All to Skills Section" to update your skills section
   - Or add individual skills by clicking "Add to Skills Section" under each experience

6. **Export Your Tailored Resume**
   - Your updated resume is automatically saved in the extension
   - You can access it anytime through the extension

### Generating Cover Letters

1. **Navigate to the Cover Letter Tab**
   - Click the "Cover Letter" tab in the extension popup

2. **Generate Cover Letter**
   - Click "Generate Cover Letter" button
   - The AI will create a cover letter based on your resume and the job description
   - This may take 15-30 seconds depending on your settings

3. **Review the Cover Letter**
   - Read through the generated cover letter
   - Check the word count (aim for 250-350 words)
   - The letter includes:
     - An engaging hook and company-specific opening
     - 2-3 proof points from your resume mapped to job requirements
     - A professional closing with call to action

4. **Export Your Cover Letter**
   - Click "Copy" to copy the full text to your clipboard
   - Click "Export .docx" to download as a Word document
   - Click "Generate New Cover Letter" if you want a different version

### Managing Settings

1. **Access Settings**
   - Click the "Settings" tab in the extension popup

2. **Privacy Options**
   - Choose between:
     - **Local Mode**: Your data never leaves your browser (requires API key)
     - **Anonymous Mode**: Process through secure backend (no API key needed)

3. **Model Selection**
   - Choose which AI provider to use:
     - OpenRouter (Llama/Mistral models)
     - Together.ai
     - Fireworks.ai
     - Ollama (local)
     - OpenAI

4. **API Keys**
   - For Local Mode, enter your API key for the selected provider
   - Keys are stored only in your browser's local storage

5. **Data Management**
   - Clear all stored data with the "Clear All Data" button
   - This removes your resume, saved job descriptions, and settings

## Troubleshooting

**Job Description Not Capturing**
- Make sure you've selected the text completely
- Try refreshing the page and selecting again
- Use the manual input option in the extension

**Resume Parsing Issues**
- Try uploading a simpler format of your resume
- Use the manual edit option to correct any parsing errors
- Make sure your PDF is text-based (not scanned)

**Extension Not Responding**
- Check your internet connection
- Verify your API key is correct (if using Local Mode)
- Try reloading the extension by right-clicking the icon and selecting "Reload"

## Privacy & Security

- **Local Processing**: By default, all data processing happens locally in your browser
- **No Data Collection**: Your resume and job descriptions are not sent to our servers
- **Local Storage Only**: All data is stored in your browser's local storage
- **API Keys**: Your API keys are stored locally and only used for direct calls to the model provider

## Frequently Asked Questions

**Q: Do I need an API key to use Taylor?**
A: It depends on your settings. In Local Mode, you need an API key from your chosen provider. In Anonymous Mode, you can use the extension without an API key.

**Q: Is my resume data secure?**
A: Yes. Your data never leaves your browser unless you choose Anonymous Mode, and even then, it's processed securely without being stored.

**Q: How accurate are the suggestions?**
A: The AI provides suggestions based on matching your experiences with job requirements. Always review suggestions for accuracy and relevance before using them.

**Q: Will this work on any job site?**
A: Yes! Taylor works on any website where you can highlight text. We also have automatic detection for popular job sites like LinkedIn, Indeed, and Glassdoor.

**Q: How many resumes can I store?**
A: Currently, the extension stores one resume at a time. We're working on supporting multiple resumes in future updates.

## Development & Contribution

For developers interested in contributing to Taylor, please see our [DEVELOPMENT.md](DEVELOPMENT.md) file for technical details and setup instructions.

## License

MIT
