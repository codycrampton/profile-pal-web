
import { Profile } from "@/types";

// Simple fuzzy search implementation
export const fuzzySearch = (profiles: Profile[], query: string): Profile[] => {
  if (!query || query.trim() === '') {
    return profiles;
  }

  const lowerQuery = query.toLowerCase().trim();
  
  return profiles.filter(profile => {
    // Check if the name contains the query (case insensitive)
    const lowerName = profile.name.toLowerCase();
    
    // Basic contains check
    if (lowerName.includes(lowerQuery)) {
      return true;
    }
    
    // Check for approximate matches (character sequence matching)
    let queryIndex = 0;
    for (let nameIndex = 0; nameIndex < lowerName.length; nameIndex++) {
      if (lowerQuery[queryIndex] === lowerName[nameIndex]) {
        queryIndex++;
      }
      
      if (queryIndex === lowerQuery.length) {
        return true;
      }
    }
    
    return false;
  });
};
