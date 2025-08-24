import React, { useState, useEffect } from 'react';

function ResumeEditor({ resume, jobDescription, onUpdate }) {
  const [tailoredSuggestions, setTailoredSuggestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeExperience, setActiveExperience] = useState(null);
  
  // Get resume tailoring suggestions when job description changes
  useEffect(() => {
    if (resume && jobDescription && jobDescription.length > 50) {
      getTailoringSuggestions();
    }
  }, [jobDescription]);
  
  // Function to get tailoring suggestions from the background script
  const getTailoringSuggestions = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Send message to background script
      chrome.runtime.sendMessage({
        action: 'tailorResume',
        data: {
          resume,
          jobDescription
        }
      }, response => {
        setIsLoading(false);
        
        if (response && response.success) {
          setTailoredSuggestions(response.data);
          // Set the first experience as active
          if (response.data.experienceSuggestions && response.data.experienceSuggestions.length > 0) {
            setActiveExperience(response.data.experienceSuggestions[0].experienceId);
          }
        } else {
          setError(response?.error || 'Failed to get tailoring suggestions');
        }
      });
    } catch (err) {
      setIsLoading(false);
      setError('Error communicating with the extension: ' + err.message);
    }
  };
  
  // Function to apply a suggested bullet to the resume
  const applySuggestion = (experienceId, newBullet) => {
    const updatedResume = { ...resume };
    
    // Find the experience to update
    const expIndex = updatedResume.experience.findIndex(exp => exp.id === experienceId);
    if (expIndex !== -1) {
      // Add the new bullet at the top of the bullets list
      updatedResume.experience[expIndex].bullets = [
        newBullet,
        ...updatedResume.experience[expIndex].bullets
      ];
      
      // Update the resume
      onUpdate(updatedResume);
      
      // Save to storage
      chrome.storage.local.set({ resume: updatedResume });
    }
  };
  
  // Function to add suggested skills to resume
  const addSkills = (skills) => {
    if (!skills || skills.length === 0) return;
    
    const updatedResume = { ...resume };
    
    // Add new skills without duplicates
    const existingSkills = new Set(updatedResume.skills);
    skills.forEach(skill => existingSkills.add(skill));
    
    updatedResume.skills = Array.from(existingSkills);
    
    // Update the resume
    onUpdate(updatedResume);
    
    // Save to storage
    chrome.storage.local.set({ resume: updatedResume });
  };
  
  // Function to copy all suggested bullets to clipboard
  const copyAllSuggestions = () => {
    if (!tailoredSuggestions || !tailoredSuggestions.experienceSuggestions) return;
    
    const allBullets = tailoredSuggestions.experienceSuggestions
      .flatMap(exp => exp.suggestedBullets)
      .join('\n\n');
    
    navigator.clipboard.writeText(allBullets).then(() => {
      alert('All suggested bullets copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };
  
  // If no job description is available, show a message
  if (!jobDescription || jobDescription.length < 50) {
    return (
      <div className="text-center py-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">No Job Description Available</h2>
        <p className="text-gray-600 mb-4">
          Please add a job description first to get tailored resume suggestions.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Go to Job Description
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Resume Tailoring</h2>
      
      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Analyzing job description and tailoring your resume...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={getTailoringSuggestions}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Try Again
          </button>
        </div>
      ) : tailoredSuggestions ? (
        <div className="space-y-6">
          {/* Key skills from job description */}
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-medium text-blue-800 mb-2">Key Skills from Job Description</h3>
            <div className="flex flex-wrap gap-2">
              {tailoredSuggestions.relevantSkills.map((skill, index) => (
                <span 
                  key={index}
                  className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
            <button 
              onClick={() => addSkills(tailoredSuggestions.relevantSkills)}
              className="mt-3 text-sm text-blue-700 hover:text-blue-900"
            >
              Add All to Skills Section
            </button>
          </div>
          
          {/* Experience suggestions */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Suggested Bullet Points</h3>
              <button 
                onClick={copyAllSuggestions}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Copy All Suggestions
              </button>
            </div>
            
            {/* Tabs for different experiences */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-4 overflow-x-auto">
                {tailoredSuggestions.experienceSuggestions.map(exp => {
                  // Try to find the actual experience details from the resume
                  const resumeExp = resume.experience.find(r => r.id === exp.experienceId);
                  const displayName = resumeExp ? 
                    `${resumeExp.role} at ${resumeExp.company}` : 
                    `Experience ${exp.experienceId}`;
                  
                  return (
                    <button
                      key={exp.experienceId}
                      className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                        activeExperience === exp.experienceId
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                      onClick={() => setActiveExperience(exp.experienceId)}
                    >
                      {displayName}
                    </button>
                  );
                })}
              </nav>
            </div>
            
            {/* Active experience details */}
            {activeExperience && (
              <div className="mt-4">
                {tailoredSuggestions.experienceSuggestions
                  .filter(exp => exp.experienceId === activeExperience)
                  .map(exp => {
                    // Find the actual experience from resume
                    const resumeExp = resume.experience.find(r => r.id === exp.experienceId);
                    
                    return (
                      <div key={exp.experienceId} className="space-y-4">
                        {/* Relevance indicator */}
                        <div className="flex items-center">
                          <span className="mr-2 text-sm font-medium">Relevance:</span>
                          <div className="flex">
                            {[...Array(3)].map((_, i) => (
                              <svg
                                key={i}
                                className={`h-5 w-5 ${
                                  i < exp.relevance ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        
                        {/* Reason for relevance */}
                        <div>
                          <span className="text-sm font-medium">Why it's relevant:</span>
                          <p className="text-sm text-gray-600">{exp.reason}</p>
                        </div>
                        
                        {/* Current bullets */}
                        {resumeExp && (
                          <div>
                            <h4 className="text-sm font-medium">Current Bullets:</h4>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                              {resumeExp.bullets.map((bullet, idx) => (
                                <li key={idx}>{bullet}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {/* Suggested bullets */}
                        <div>
                          <h4 className="text-sm font-medium">Suggested Bullets:</h4>
                          <div className="space-y-2 mt-1">
                            {exp.suggestedBullets.map((bullet, idx) => (
                              <div 
                                key={idx}
                                className="bg-green-50 border border-green-100 p-3 rounded relative"
                              >
                                <p className="text-sm pr-8">{bullet}</p>
                                <div className="absolute top-2 right-2 flex space-x-1">
                                  <button 
                                    onClick={() => {
                                      navigator.clipboard.writeText(bullet);
                                      alert('Copied to clipboard!');
                                    }}
                                    className="text-gray-500 hover:text-gray-700"
                                    title="Copy to clipboard"
                                  >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                    </svg>
                                  </button>
                                  <button 
                                    onClick={() => applySuggestion(exp.experienceId, bullet)}
                                    className="text-blue-500 hover:text-blue-700"
                                    title="Apply to resume"
                                  >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Suggested skills */}
                        {exp.suggestedSkills && exp.suggestedSkills.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium">Suggested Skills to Add:</h4>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {exp.suggestedSkills.map((skill, idx) => (
                                <span 
                                  key={idx}
                                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                            <button 
                              onClick={() => addSkills(exp.suggestedSkills)}
                              className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                            >
                              Add to Skills Section
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <button 
            onClick={getTailoringSuggestions}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Generate Tailored Resume Suggestions
          </button>
        </div>
      )}
    </div>
  );
}

export default ResumeEditor;
