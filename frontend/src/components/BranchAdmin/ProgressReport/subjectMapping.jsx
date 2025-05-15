// Create a new file: src/utils/subjectMapping.js

// Map database subject names to display names
const subjectMappings = {
    // Standard names
    'telugu': 'Telugu',
    'తెలుగు': 'Telugu',
    'english': 'English',
    'ఇంగ్లీష్': 'English',
    'hindi': 'Hindi',
    'హిందీ': 'Hindi',
    'maths': 'Maths',
    'mathematics': 'Maths',
    'గణితం': 'Maths',
    'social': 'Social',
    'సామాజిక': 'Social',
    'science': 'Science',
    'విజ్ఞానశాస్త్రం': 'Science',
    
    // Additional mappings from your database
    'gk': 'English',        // Map 'gk' to 'English'
    'computer': 'Social',   // Map 'computer' to 'Social'
  };
  
  export const normalizeSubjectName = (name) => {
    if (!name) return '';
    
    // Convert to lowercase and remove extra spaces
    const normalized = name.trim().toLowerCase();
    
    // Check direct mapping
    return subjectMappings[normalized] || name;
  };
  
  // Function to map database subjects to display subjects
  export const mapDatabaseSubjects = (databaseSubjects) => {
    const mappedSubjects = {};
    
    databaseSubjects.forEach(subject => {
      const normalizedName = normalizeSubjectName(subject.name);
      if (normalizedName) {
        mappedSubjects[normalizedName] = {
          ...subject,
          name: normalizedName
        };
      }
    });
    
    return mappedSubjects;
  };
  