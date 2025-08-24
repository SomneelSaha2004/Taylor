import React, { useState, useEffect } from 'react';
import ResumeUploader from './components/ResumeUploader';
import JobDescription from './components/JobDescription';
import ResumeEditor from './components/ResumeEditor';
import CoverLetterGenerator from './components/CoverLetterGenerator';
import Settings from './components/Settings';
import { Tab } from '@headlessui/react';

function App() {
  // State for the app
  const [currentTab, setCurrentTab] = useState(0);
  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState(null);
  const [isFirstRun, setIsFirstRun] = useState(true);
  
  // Check if this is the first run
  useEffect(() => {
    chrome.storage.local.get(['resume', 'profile'], (result) => {
      if (result.resume && result.profile && result.profile.name) {
        setIsFirstRun(false);
        setResume(result.resume);
      }
    });
    
    // Listen for highlighted text from the content script
    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === 'updateHighlightedText') {
        setJobDescription(message.data);
      }
    });
    
    // Get current highlighted text when popup opens
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getHighlightedTextFromPage' }, (response) => {
        if (response && response.text) {
          setJobDescription(response.text);
        }
      });
    });
  }, []);
  
  // If it's the first run, show the resume upload component
  if (isFirstRun) {
    return (
      <div className="h-full bg-gray-50">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">Taylor</h1>
          <p className="text-sm">Resume Tailoring Assistant</p>
        </header>
        <main className="p-4">
          <ResumeUploader onComplete={(uploadedResume) => {
            setResume(uploadedResume);
            setIsFirstRun(false);
            // Save to storage
            chrome.storage.local.set({ resume: uploadedResume });
          }} />
        </main>
      </div>
    );
  }
  
  return (
    <div className="h-full bg-gray-50">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Taylor</h1>
        <p className="text-sm">Resume Tailoring Assistant</p>
      </header>
      
      <main className="p-4">
        <Tab.Group selectedIndex={currentTab} onChange={setCurrentTab}>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            <Tab className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
              ${selected ? 'bg-white shadow' : 'text-blue-500 hover:bg-white/[0.12] hover:text-blue-600'}`
            }>
              Job Description
            </Tab>
            <Tab className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
              ${selected ? 'bg-white shadow' : 'text-blue-500 hover:bg-white/[0.12] hover:text-blue-600'}`
            }>
              Tailor Resume
            </Tab>
            <Tab className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
              ${selected ? 'bg-white shadow' : 'text-blue-500 hover:bg-white/[0.12] hover:text-blue-600'}`
            }>
              Cover Letter
            </Tab>
            <Tab className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
              ${selected ? 'bg-white shadow' : 'text-blue-500 hover:bg-white/[0.12] hover:text-blue-600'}`
            }>
              Settings
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-2">
            <Tab.Panel className="rounded-xl bg-white p-3">
              <JobDescription 
                jobDescription={jobDescription}
                onUpdate={setJobDescription}
              />
            </Tab.Panel>
            <Tab.Panel className="rounded-xl bg-white p-3">
              <ResumeEditor 
                resume={resume}
                jobDescription={jobDescription}
                onUpdate={setResume}
              />
            </Tab.Panel>
            <Tab.Panel className="rounded-xl bg-white p-3">
              <CoverLetterGenerator
                resume={resume}
                jobDescription={jobDescription}
              />
            </Tab.Panel>
            <Tab.Panel className="rounded-xl bg-white p-3">
              <Settings />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </main>
    </div>
  );
}

export default App;
