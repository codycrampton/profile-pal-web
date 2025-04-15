
import { Profile } from "@/types";

// Enhanced fuzzy search implementation
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
    
    // Check for properties that might contain the query
    if (profile.traits && profile.traits.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    
    if (profile.work && profile.work.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    
    if (profile.hairColor && profile.hairColor.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    
    if (profile.braSize && profile.braSize.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    
    if (profile.bra_size && profile.bra_size.toLowerCase().includes(lowerQuery)) {
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
