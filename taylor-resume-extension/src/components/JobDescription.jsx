import React, { useState } from 'react';

function JobDescription({ jobDescription, onUpdate }) {
  const [editMode, setEditMode] = useState(false);
  const [localJD, setLocalJD] = useState(jobDescription);
  
  const handleSave = () => {
    onUpdate(localJD);
    setEditMode(false);
  };
  
  // Extract job information (title, company, etc)
  const extractedInfo = jobDescription ? extractJobInfo(jobDescription) : null;
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Job Description</h2>
      
      {editMode ? (
        <>
          <textarea
            className="w-full h-64 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={localJD}
            onChange={(e) => setLocalJD(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <button 
              onClick={() => setEditMode(false)} 
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </>
      ) : (
        <>
          {extractedInfo && (
            <div className="bg-blue-50 p-3 rounded">
              {extractedInfo.title && <p className="font-medium">{extractedInfo.title}</p>}
              {extractedInfo.company && <p>{extractedInfo.company}</p>}
              {extractedInfo.location && <p className="text-sm text-gray-600">{extractedInfo.location}</p>}
            </div>
          )}
          
          <div className="max-h-64 overflow-y-auto border border-gray-200 rounded p-3 bg-gray-50">
            {jobDescription ? (
              <p className="whitespace-pre-line">{jobDescription}</p>
            ) : (
              <p className="text-gray-500 italic">
                Highlight a job description on any website and click the extension icon, 
                or paste a job description here.
              </p>
            )}
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={() => setEditMode(true)} 
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              {jobDescription ? 'Edit' : 'Add Job Description'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Function to extract job information from the job description
function extractJobInfo(jobDescription) {
  // This is a simple implementation and would need to be enhanced
  // for better accuracy in a production environment
  
  const info = {
    title: null,
    company: null,
    location: null,
    seniority: null,
  };
  
  // Try to extract job title
  const titlePatterns = [
    /job title:?\s*([^\n]+)/i,
    /position:?\s*([^\n]+)/i,
    /role:?\s*([^\n]+)/i
  ];
  
  for (const pattern of titlePatterns) {
    const match = jobDescription.match(pattern);
    if (match && match[1]) {
      info.title = match[1].trim();
      break;
    }
  }
  
  // Try to extract company
  const companyPatterns = [
    /company:?\s*([^\n]+)/i,
    /at\s+([A-Z][A-Za-z0-9\s&]+)[\n,]/
  ];
  
  for (const pattern of companyPatterns) {
    const match = jobDescription.match(pattern);
    if (match && match[1]) {
      info.company = match[1].trim();
      break;
    }
  }
  
  // Try to extract location
  const locationPatterns = [
    /location:?\s*([^\n]+)/i,
    /in\s+([A-Z][A-Za-z\s,]+)[\n\.]/
  ];
  
  for (const pattern of locationPatterns) {
    const match = jobDescription.match(pattern);
    if (match && match[1]) {
      info.location = match[1].trim();
      break;
    }
  }
  
  return info;
}

export default JobDescription;
