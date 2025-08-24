import React, { useState } from 'react';
import { parseResumePDF, parseResumeDocx } from '../utils/resumeParser';

function ResumeUploader({ onComplete }) {
  const [uploadStep, setUploadStep] = useState(1);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [parsedResume, setParsedResume] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Profile information
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    links: []
  });
  
  // Resume sections
  const [resume, setResume] = useState({
    summary: '',
    skills: [],
    experience: [],
    projects: [],
    education: []
  });
  
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setResumeFile(file);
    setIsLoading(true);
    setError('');
    
    try {
      let parsedText = '';
      let parsedStructure = null;
      
      // Parse file based on type
      if (file.type === 'application/pdf') {
        parsedText = await parseResumePDF(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        parsedText = await parseResumeDocx(file);
      } else {
        throw new Error('Unsupported file type. Please upload PDF or DOCX file.');
      }
      
      setResumeText(parsedText);
      
      // Move to manual parsing step for now
      // In a real implementation, we would use NLP to parse this text into structured data
      setUploadStep(2);
    } catch (err) {
      console.error('Error parsing resume:', err);
      setError(err.message || 'Error parsing resume file');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleManualTextSubmit = () => {
    // Simple parsing logic - this would be much more sophisticated in a real implementation
    const parsed = basicResumeParser(resumeText);
    setParsedResume(parsed);
    
    // Pre-fill the form with parsed data
    setProfile({
      name: parsed.name || '',
      email: parsed.email || '',
      phone: parsed.phone || '',
      location: parsed.location || '',
      links: parsed.links || []
    });
    
    setResume({
      summary: parsed.summary || '',
      skills: parsed.skills || [],
      experience: parsed.experience || [],
      projects: parsed.projects || [],
      education: parsed.education || []
    });
    
    setUploadStep(3);
  };
  
  const handleTextareaChange = (e) => {
    setResumeText(e.target.value);
  };
  
  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };
  
  const handleResumeChange = (field, value) => {
    setResume(prev => ({ ...prev, [field]: value }));
  };
  
  const handleAddExperience = () => {
    setResume(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: Date.now().toString(), role: '', company: '', location: '', startDate: '', endDate: '', bullets: [''] }
      ]
    }));
  };
  
  const handleExperienceChange = (id, field, value) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };
  
  const handleBulletChange = (expId, index, value) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map(exp => {
        if (exp.id === expId) {
          const newBullets = [...exp.bullets];
          newBullets[index] = value;
          return { ...exp, bullets: newBullets };
        }
        return exp;
      })
    }));
  };
  
  const handleAddBullet = (expId) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map(exp => {
        if (exp.id === expId) {
          return { ...exp, bullets: [...exp.bullets, ''] };
        }
        return exp;
      })
    }));
  };
  
  const handleSubmitResume = () => {
    // Combine profile and resume data
    const completeResume = {
      ...resume,
      profile: profile
    };
    
    // Store in Chrome storage
    chrome.storage.local.set({
      profile: profile,
      resume: resume
    });
    
    // Call the callback with the complete resume
    onComplete(resume);
  };
  
  // Render different steps based on upload progress
  return (
    <div className="space-y-6">
      {uploadStep === 1 && (
        <>
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Welcome to Taylor!</h2>
            <p className="text-gray-600 mb-4">Upload your resume to get started</p>
            
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">PDF or DOCX (MAX. 5MB)</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.docx" 
                  onChange={handleFileUpload} 
                  disabled={isLoading}
                />
              </label>
            </div>
            
            {isLoading && <p className="text-blue-600 mt-2">Processing your resume...</p>}
            {error && <p className="text-red-500 mt-2">{error}</p>}
            
            <div className="mt-4">
              <p className="text-gray-500 text-sm">Or</p>
              <button 
                onClick={() => setUploadStep(2)}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Enter your resume details manually
              </button>
            </div>
          </div>
        </>
      )}
      
      {uploadStep === 2 && (
        <>
          <div>
            <h2 className="text-xl font-semibold mb-2">Review Extracted Text</h2>
            <p className="text-gray-600 mb-4">
              We've extracted the text from your resume. Please review and make any necessary corrections.
            </p>
            
            <textarea 
              className="w-full h-64 p-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={resumeText}
              onChange={handleTextareaChange}
            ></textarea>
            
            <div className="flex justify-between mt-4">
              <button 
                onClick={() => setUploadStep(1)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
              >
                Back
              </button>
              <button 
                onClick={handleManualTextSubmit}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Continue
              </button>
            </div>
          </div>
        </>
      )}
      
      {uploadStep === 3 && (
        <>
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Confirm Your Resume Structure</h2>
            <p className="text-gray-600">
              Review and edit your resume information below.
            </p>
            
            <div className="space-y-4">
              <h3 className="font-medium">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input 
                    type="text" 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                    value={profile.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input 
                    type="email" 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input 
                    type="tel" 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                    value={profile.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input 
                    type="text" 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                    value={profile.location}
                    onChange={(e) => handleProfileChange('location', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mt-6">Professional Summary</h3>
                <textarea 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                  rows="3"
                  value={resume.summary}
                  onChange={(e) => handleResumeChange('summary', e.target.value)}
                ></textarea>
              </div>
              
              <div>
                <h3 className="font-medium mt-6">Skills</h3>
                <textarea 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                  rows="2"
                  placeholder="Enter skills separated by commas"
                  value={resume.skills.join(', ')}
                  onChange={(e) => handleResumeChange('skills', e.target.value.split(',').map(s => s.trim()))}
                ></textarea>
              </div>
              
              <div>
                <h3 className="font-medium mt-6">Experience</h3>
                {resume.experience.map((exp, index) => (
                  <div key={exp.id} className="mb-4 p-3 border border-gray-200 rounded">
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <input 
                          type="text" 
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                          value={exp.role}
                          onChange={(e) => handleExperienceChange(exp.id, 'role', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Company</label>
                        <input 
                          type="text" 
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                          value={exp.company}
                          onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input 
                          type="text" 
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                          value={exp.location}
                          onChange={(e) => handleExperienceChange(exp.id, 'location', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input 
                          type="text" 
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                          value={exp.startDate}
                          onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">End Date</label>
                        <input 
                          type="text" 
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                          value={exp.endDate}
                          onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700">Bullet Points</label>
                      {exp.bullets.map((bullet, bulletIndex) => (
                        <div key={bulletIndex} className="mt-1">
                          <input 
                            type="text" 
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                            value={bullet}
                            onChange={(e) => handleBulletChange(exp.id, bulletIndex, e.target.value)}
                          />
                        </div>
                      ))}
                      <button 
                        type="button"
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                        onClick={() => handleAddBullet(exp.id)}
                      >
                        + Add Bullet
                      </button>
                    </div>
                  </div>
                ))}
                
                <button 
                  type="button"
                  className="mt-2 px-3 py-1 text-sm border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
                  onClick={handleAddExperience}
                >
                  + Add Experience
                </button>
              </div>
              
              {/* Add similar sections for Education and Projects */}
              
              <div className="flex justify-between mt-8">
                <button 
                  onClick={() => setUploadStep(2)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Back
                </button>
                <button 
                  onClick={handleSubmitResume}
                  className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Save Resume
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// A very simple resume parser for demonstration
// In a real implementation, this would be much more sophisticated
function basicResumeParser(text) {
  const parsed = {
    name: '',
    email: '',
    phone: '',
    location: '',
    links: [],
    summary: '',
    skills: [],
    experience: [],
    projects: [],
    education: []
  };
  
  // Very basic extraction of email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    parsed.email = emailMatch[0];
  }
  
  // Very basic extraction of phone number
  const phoneMatch = text.match(/(\+\d{1,2}\s?)?(\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}/);
  if (phoneMatch) {
    parsed.phone = phoneMatch[0];
  }
  
  // Attempt to find a LinkedIn URL
  const linkedInMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/);
  if (linkedInMatch) {
    parsed.links.push(linkedInMatch[0]);
  }
  
  // Try to extract skills (this is very naive)
  const skillsSection = text.match(/skills[\s\n]*:?([\s\S]*?)(?=experience|education|projects|$)/i);
  if (skillsSection && skillsSection[1]) {
    const skillsText = skillsSection[1].trim();
    parsed.skills = skillsText.split(/[,\n•]/).map(s => s.trim()).filter(Boolean);
  }
  
  // Create a placeholder experience entry
  parsed.experience = [
    {
      id: '1',
      role: 'Position Title',
      company: 'Company Name',
      location: 'Location',
      startDate: 'Start Date',
      endDate: 'End Date',
      bullets: ['Responsibility/achievement 1', 'Responsibility/achievement 2']
    }
  ];
  
  return parsed;
}

export default ResumeUploader;
