// Content script for Taylor Resume Extension
// This script runs on web pages and can access the DOM

// Listen for text selection changes
document.addEventListener('mouseup', () => {
  const selectedText = window.getSelection().toString().trim();
  
  if (selectedText.length > 10) { // Only capture meaningful selections
    // Send the selected text to the extension
    chrome.runtime.sendMessage({
      action: 'getHighlightedText',
      data: selectedText
    });
  }
});

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getHighlightedTextFromPage') {
    const selectedText = window.getSelection().toString().trim();
    sendResponse({ text: selectedText });
  }
  return true;
});

// Auto-detect job description on popular job sites
function detectJobDescription() {
  // Detect common job description containers based on URL patterns
  let jobDescription = '';
  
  // LinkedIn
  if (window.location.hostname.includes('linkedin.com') && window.location.pathname.includes('/jobs/')) {
    const jobDescriptionElement = document.querySelector('.job-details');
    if (jobDescriptionElement) {
      jobDescription = jobDescriptionElement.textContent;
    }
  }
  
  // Indeed
  else if (window.location.hostname.includes('indeed.com')) {
    const jobDescriptionElement = document.querySelector('#jobDescriptionText');
    if (jobDescriptionElement) {
      jobDescription = jobDescriptionElement.textContent;
    }
  }
  
  // Glassdoor
  else if (window.location.hostname.includes('glassdoor.com')) {
    const jobDescriptionElement = document.querySelector('.jobDesc');
    if (jobDescriptionElement) {
      jobDescription = jobDescriptionElement.textContent;
    }
  }
  
  // If a job description was found, send it to the extension
  if (jobDescription.length > 50) {
    chrome.runtime.sendMessage({
      action: 'getHighlightedText',
      data: jobDescription
    });
  }
}

// Run the detection when the page loads
window.addEventListener('load', detectJobDescription);
