// Background service worker for Taylor Resume Extension
// Handles message passing between content scripts and popup

// Initialize the extension data store
chrome.runtime.onInstalled.addListener(() => {
  // Set up initial storage structure
  chrome.storage.local.set({
    profile: {
      name: '',
      email: '',
      phone: '',
      location: '',
      links: []
    },
    resume: {
      summary: '',
      skills: [],
      experience: [],
      projects: [],
      education: []
    },
    settings: {
      privacyMode: 'local', // 'local' or 'anonymous'
      selectedModelProvider: 'openRouter', // 'openRouter', 'together', 'fireworks', 'ollama', 'openai'
      apiKeys: {}
    },
    cache: {
      jobDescriptions: []
    }
  });
});

// Listen for messages from the content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'getHighlightedText':
      // Forward the highlighted text to the popup
      chrome.runtime.sendMessage({
        action: 'updateHighlightedText',
        data: message.data
      });
      break;
      
    case 'tailorResume':
      // Process the resume tailoring request
      processResumeTailoring(message.data.resume, message.data.jobDescription)
        .then(result => sendResponse({ success: true, data: result }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true; // Keeps the message channel open for async response
      
    case 'generateCoverLetter':
      // Generate a cover letter
      generateCoverLetter(message.data.resume, message.data.jobDescription)
        .then(result => sendResponse({ success: true, data: result }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true; // Keeps the message channel open for async response
  }
});

// Resume tailoring logic
async function processResumeTailoring(resume, jobDescription) {
  // Get the user's settings
  const { settings } = await chrome.storage.local.get('settings');
  
  // Based on the mode, either process locally or send to the selected model provider
  if (settings.privacyMode === 'local' && settings.apiKeys[settings.selectedModelProvider]) {
    return await callModelProvider(
      settings.selectedModelProvider,
      settings.apiKeys[settings.selectedModelProvider],
      buildResumeTailoringPrompt(resume, jobDescription)
    );
  } else {
    // If no API key or in anonymous mode, we would send to our backend
    // This is stubbed for now - would call your API endpoint
    return {
      relevantSkills: ['Skill 1', 'Skill 2', 'Skill 3'],
      experienceSuggestions: [
        {
          experienceId: 'exp1',
          relevance: 2,
          reason: 'This experience is relevant because...',
          suggestedBullets: [
            'Led cross-functional team to deliver project X on time and under budget, resulting in 20% cost savings.',
            'Implemented automated testing framework that reduced bug reports by 35% and improved deployment speed.'
          ],
          suggestedSkills: ['Project Management', 'Automated Testing']
        }
        // Other experience suggestions would follow
      ]
    };
  }
}

// Cover letter generation logic
async function generateCoverLetter(resume, jobDescription) {
  // Get the user's settings
  const { settings } = await chrome.storage.local.get('settings');
  
  // Based on the mode, either process locally or send to the selected model provider
  if (settings.privacyMode === 'local' && settings.apiKeys[settings.selectedModelProvider]) {
    return await callModelProvider(
      settings.selectedModelProvider,
      settings.apiKeys[settings.selectedModelProvider],
      buildCoverLetterPrompt(resume, jobDescription)
    );
  } else {
    // If no API key or in anonymous mode, we would send to our backend
    // This is stubbed for now - would call your API endpoint
    return {
      coverLetter: "Dear Hiring Manager,\n\nI am excited to apply for the position of...",
      wordCount: 320
    };
  }
}

// Function to call selected model provider
async function callModelProvider(provider, apiKey, prompt) {
  // Implementation would vary based on the provider
  // This is a placeholder that would be replaced with actual API calls
  switch (provider) {
    case 'openRouter':
      // Call OpenRouter API with the prompt
      return { message: "This is a placeholder for OpenRouter API response" };
    
    case 'together':
      // Call Together API with the prompt
      return { message: "This is a placeholder for Together API response" };
      
    case 'fireworks':
      // Call Fireworks API with the prompt
      return { message: "This is a placeholder for Fireworks API response" };
      
    case 'ollama':
      // Call Ollama API with the prompt
      return { message: "This is a placeholder for Ollama API response" };
      
    case 'openai':
      // Call OpenAI API with the prompt
      return { message: "This is a placeholder for OpenAI API response" };
      
    default:
      throw new Error(`Unsupported model provider: ${provider}`);
  }
}

// Build prompt for resume tailoring
function buildResumeTailoringPrompt(resume, jobDescription) {
  return `
System: You are a strict resume editor. Never invent experience. Use action verbs + metrics.
User:
RESUME (JSON):
${JSON.stringify(resume)}

JOB DESCRIPTION (text):
"""
${jobDescription}
"""

TASK:
1) List the 6–10 most relevant skills/phrases from the JD.
2) For each RESUME experience or project, output:
   - Relevance (0–3) and why
   - 1–2 rewritten bullets that align with the JD while staying truthful
   - Optional skill tags to add under "Skills"
Constraints:
- Keep bullets <= 25 words, start with strong verbs, add concrete metrics where they already exist.
- DO NOT invent tools or results that aren't in the resume. If missing, suggest neutral phrasing (e.g., "optimized", "improved") without fake numbers.
`;
}

// Build prompt for cover letter generation
function buildCoverLetterPrompt(resume, jobDescription) {
  return `
System: You write concise, specific cover letters grounded ONLY in the provided resume.
User:
RESUME (JSON):
${JSON.stringify(resume)}

JOB DESCRIPTION:
"""
${jobDescription}
"""

Write a 250–350 word letter:
- 1: Hook + why this role/company
- 2: 2–3 proof points from resume mapped to JD requirements (no new claims)
- 3: Close + availability + polite CTA
Tone: crisp, professional, specific. No fluff or clichés.
`;
}
