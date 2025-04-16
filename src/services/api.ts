
import { Profile, ProfileFormData } from "@/types";
import { toast } from "sonner";

// API configuration 
const API_ENDPOINT = '/profiles-data.json'; // Local JSON file in the repository
const LOCAL_STORAGE_KEY = 'profileAppData';

// Default headers
const defaultHeaders = {
  'Content-Type': 'application/json'
};

// Initialize localStorage with data from local file if empty
const initializeLocalStorage = async () => {
  const existingData = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!existingData) {
    try {
      const response = await fetch(API_ENDPOINT);
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        console.log('Initialized local storage with data from repository');
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
        console.warn('Failed to load initial data, starting with empty profiles');
      }
    } catch (error) {
      console.error('Error initializing local storage:', error);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
    }
  }
};

// Function to persist changes back to the "GitHub" repository
// In a real environment, this would use GitHub API, but for this demo we'll simulate it
const persistChangesToRepository = async (profiles: Profile[]) => {
  try {
    console.log('Persisting profile changes to repository:', profiles.length);
    
    // In a real implementation, this would be a call to GitHub API
    // For now, we'll just log this action and update local storage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profiles));
    
    // This is where you would typically make a GitHub API call to update the repository file
    // For example:
    // const response = await fetch('/api/github/update-profiles', {
    //   method: 'POST',
    //   headers: defaultHeaders,
    //   body: JSON.stringify(profiles)
    // });
    
    return true;
  } catch (error) {
    console.error('Failed to persist changes to repository:', error);
    return false;
  }
};

// Convert from API format to our internal format if needed
const normalizeProfile = (profile: any): Profile => {
  return {
    id: profile.id,
    name: profile.name,
    photo_url: profile.imageURL || profile.photo_url || '',
    braSize: profile.braSize || profile.bra_size,
    bra_size: profile.braSize || profile.bra_size,
    measurement_1: profile.measurement_1 || profile.bust,
    measurement_2: profile.measurement_2 || profile.waist,
    measurement_3: profile.measurement_3 || profile.hips,
    bust: profile.bust || profile.measurement_1,
    waist: profile.waist || profile.measurement_2,
    hips: profile.hips || profile.measurement_3,
    instagram_url: profile.instagram_url || profile.instagram,
    instagram: profile.instagram || profile.instagram_url,
    twitter_url: profile.twitter_url || profile.twitter,
    twitter: profile.twitter || profile.twitter_url,
    tiktok_url: profile.tiktok_url || profile.tiktok,
    tiktok: profile.tiktok || profile.tiktok_url,
    babepedia: profile.babepedia,
    imageURL: profile.imageURL || profile.photo_url,
    isFictional: profile.isFictional,
    work: profile.work,
    wikiURL: profile.wikiURL,
    notes: profile.notes,
    isMetric: profile.isMetric,
    traits: profile.traits,
    hairColor: profile.hairColor,
    height: profile.height,
    weight: profile.weight,
    underbust: profile.underbust,
    threads: profile.threads
  };
};

// Format height function
export const formatHeight = (height: number | undefined, isMetric: number | undefined): string => {
  if (height === undefined || height === 0) return '';
  
  if (isMetric) {
    return `${height} cm`;
  } else {
    // Convert decimal feet to feet and inches
    const feet = Math.floor(height);
    const inches = Math.round((height - feet) * 12);
    
    if (feet === 0) {
      return `${inches}"`;
    } else if (inches === 0) {
      return `${feet}'`;
    } else {
      return `${feet}' ${inches}"`;
    }
  }
};

// API service with methods
export const api = {
  // Initialize data
  init: async () => {
    await initializeLocalStorage();
    console.log('API service initialized');
  },

  // Get all profiles
  getProfiles: async (): Promise<Profile[]> => {
    try {
      console.log('Fetching profiles from repository JSON file...');
      const response = await fetch(API_ENDPOINT);

      if (!response.ok) {
        throw new Error(`Failed to fetch profiles: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Profiles retrieved successfully:', data.length);
      
      // Update local storage with the latest data
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      
      return data.map(normalizeProfile);
    } catch (error) {
      console.error('Failed to fetch profiles from repository, using local storage:', error);
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      const profiles = localData ? JSON.parse(localData) : [];
      return profiles.map(normalizeProfile);
    }
  },

  // Create a new profile
  createProfile: async (profile: ProfileFormData): Promise<Profile> => {
    try {
      // Generate a UUID for the new profile
      const newProfile = {
        ...profile,
        id: crypto.randomUUID()
      };
      
      // Get existing profiles from local storage
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      const profiles: Profile[] = localData ? JSON.parse(localData) : [];
      
      // Add the new profile
      const updatedProfiles = [...profiles, newProfile];
      
      // Save to local storage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProfiles));
      
      // Persist changes to repository
      await persistChangesToRepository(updatedProfiles);
      
      toast.success(`Profile "${profile.name}" created successfully`);
      return normalizeProfile(newProfile);
    } catch (error) {
      console.error("Failed to create profile:", error);
      toast.error(`Failed to create profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  },

  // Update an existing profile
  updateProfile: async (id: number | string, profile: ProfileFormData): Promise<Profile> => {
    try {
      // Get existing profiles from local storage
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      const profiles: Profile[] = localData ? JSON.parse(localData) : [];
      
      // Update the profile
      const updatedProfiles = profiles.map(p => p.id === id ? { ...profile, id } : p);
      
      // Save to local storage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProfiles));
      
      // Persist changes to repository
      await persistChangesToRepository(updatedProfiles);
      
      toast.success(`Profile "${profile.name}" updated successfully`);
      return normalizeProfile({ ...profile, id });
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(`Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  },

  // Delete a profile
  deleteProfile: async (id: number | string): Promise<void> => {
    try {
      // Get existing profiles from local storage
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      const profiles: Profile[] = localData ? JSON.parse(localData) : [];
      
      // Find the profile to be deleted for the toast message
      const deletedProfile = profiles.find(p => p.id === id);
      
      // Remove the profile
      const filteredProfiles = profiles.filter(p => p.id !== id);
      
      // Save to local storage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filteredProfiles));
      
      // Persist changes to repository
      await persistChangesToRepository(filteredProfiles);
      
      if (deletedProfile) {
        toast.success(`Profile "${deletedProfile.name}" deleted successfully`);
      } else {
        toast.info('Profile not found or already deleted');
      }
    } catch (error) {
      console.error("Failed to delete profile:", error);
      toast.error(`Failed to delete profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
};
