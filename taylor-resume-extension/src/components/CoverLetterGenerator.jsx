import React, { useState } from 'react';

function CoverLetterGenerator({ resume, jobDescription }) {
  const [coverLetter, setCoverLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [wordCount, setWordCount] = useState(0);
  
  // Function to generate a cover letter
  const generateCoverLetter = async () => {
    if (!resume || !jobDescription) {
      setError('Both resume and job description are required to generate a cover letter');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Send message to background script
      chrome.runtime.sendMessage({
        action: 'generateCoverLetter',
        data: {
          resume,
          jobDescription
        }
      }, response => {
        setIsLoading(false);
        
        if (response && response.success) {
          setCoverLetter(response.data.coverLetter);
          setWordCount(response.data.wordCount || countWords(response.data.coverLetter));
        } else {
          setError(response?.error || 'Failed to generate cover letter');
        }
      });
    } catch (err) {
      setIsLoading(false);
      setError('Error communicating with the extension: ' + err.message);
    }
  };
  
  // Helper function to count words in a string
  const countWords = (text) => {
    return text.split(/\s+/).filter(Boolean).length;
  };
  
  // Function to copy the cover letter to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter).then(() => {
      alert('Cover letter copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };
  
  // Function to export cover letter as a .docx file
  const exportToDocx = () => {
    // This would normally use a library like docx.js to create a proper Word document
    // For this example, we'll create a simple text file with a .docx extension
    
    const blob = new Blob([coverLetter], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Cover Letter.docx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // If no job description is available, show a message
  if (!jobDescription || jobDescription.length < 50) {
    return (
      <div className="text-center py-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">No Job Description Available</h2>
        <p className="text-gray-600 mb-4">
          Please add a job description first to generate a cover letter.
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
      <h2 className="text-lg font-semibold text-gray-800">Cover Letter Generator</h2>
      
      <p className="text-gray-600 text-sm">
        Generate a concise, professional cover letter based on your resume and the job description.
      </p>
      
      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Generating your cover letter...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={generateCoverLetter}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Try Again
          </button>
        </div>
      ) : coverLetter ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {wordCount} words ({wordCount < 250 ? 'Under target' : wordCount > 350 ? 'Over target' : 'Good length'})
            </span>
            <div className="space-x-2">
              <button 
                onClick={copyToClipboard}
                className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
              >
                Copy
              </button>
              <button 
                onClick={exportToDocx}
                className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Export .docx
              </button>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded p-4 h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap font-sans">{coverLetter}</pre>
          </div>
          
          <div className="text-center">
            <button 
              onClick={generateCoverLetter}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Generate New Cover Letter
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <button 
            onClick={generateCoverLetter}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Generate Cover Letter
          </button>
        </div>
      )}
    </div>
  );
}

export default CoverLetterGenerator;
