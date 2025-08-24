// Utility functions for parsing resume files

// Parse PDF files using pdf-parse library
export async function parseResumePDF(file) {
  const pdfParse = await import('pdf-parse');
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const typedArray = new Uint8Array(event.target.result);
        const pdfData = await pdfParse.default(typedArray);
        resolve(pdfData.text);
      } catch (error) {
        reject(new Error('Failed to parse PDF: ' + error.message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read the file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

// Parse DOCX files using mammoth library
export async function parseResumeDocx(file) {
  const mammoth = await import('mammoth');
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target.result;
        const result = await mammoth.extractRawText({ arrayBuffer });
        resolve(result.value);
      } catch (error) {
        reject(new Error('Failed to parse DOCX: ' + error.message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read the file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

// Helper function to extract sections from resume text
export function extractSectionsFromText(text) {
  // This is a placeholder for a more sophisticated section extraction function
  // In a real implementation, you would use NLP or regex patterns to identify sections
  
  const sections = {
    contact: '',
    summary: '',
    skills: '',
    experience: '',
    education: '',
    projects: ''
  };
  
  // Simple pattern matching for common section headers
  const summaryMatch = text.match(/(?:summary|profile|objective|about me)(.+?)(?=skills|experience|education|projects|$)/is);
  if (summaryMatch) {
    sections.summary = summaryMatch[1].trim();
  }
  
  const skillsMatch = text.match(/skills(.+?)(?=experience|education|projects|$)/is);
  if (skillsMatch) {
    sections.skills = skillsMatch[1].trim();
  }
  
  const experienceMatch = text.match(/(?:experience|employment|work)(.+?)(?=education|projects|skills|$)/is);
  if (experienceMatch) {
    sections.experience = experienceMatch[1].trim();
  }
  
  const educationMatch = text.match(/education(.+?)(?=experience|projects|skills|$)/is);
  if (educationMatch) {
    sections.education = educationMatch[1].trim();
  }
  
  const projectsMatch = text.match(/projects(.+?)(?=experience|education|skills|$)/is);
  if (projectsMatch) {
    sections.projects = projectsMatch[1].trim();
  }
  
  return sections;
}
