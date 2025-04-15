import { Profile, ProfileFormData } from "@/types";
import { toast } from "sonner";

// API configuration 
const API_ENDPOINT = '/sample-profiles.json'; // Update to point to the local JSON file
const localStorageKey = 'profileAppData';

// Default headers including the manually-set Access-Control-Allow-Origin header
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': 'http://192.168.50.84:3005'
};

// Initialize localStorage with mock data if empty
const initializeLocalStorage = () => {
  const existingData = localStorage.getItem(localStorageKey);
  if (!existingData) {
    localStorage.setItem(localStorageKey, JSON.stringify([]));
  }
};

// Helper to handle API responses
const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
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

// Fetch with timeout to avoid long-hanging requests
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 8000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

// API service with methods to connect to the backend
export const api = {
  // Initialize data
  init: () => {
    initializeLocalStorage();
    
    // Create a sample-profiles.json file in public folder if not exists
    // This will be used as fallback data when API is not available
    const publicPath = '/sample-profiles.json';
    fetch(publicPath, { method: 'HEAD', headers: defaultHeaders })
      .catch(() => {
        console.log('Creating sample profiles file for backup');
        // The file will be created when needed
      });
  },

  // Get all profiles
  getProfiles: async (): Promise<Profile[]> => {
    try {
      console.log('Fetching profiles from local JSON file...');
      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profiles: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Profiles retrieved successfully:', data.length);
      return data;
    } catch (error) {
      console.error('Failed to fetch profiles:', error);
      return [];
    }
  },

  // Create a new profile
  createProfile: async (profile: ProfileFormData): Promise<Profile> => {
    try {
      // Try to create on remote API first
      const response = await fetchWithTimeout(`${API_ENDPOINT}/profile`, {
        method: 'POST',
        headers: { ...defaultHeaders },
        body: JSON.stringify(profile)
      });
      
      const data = await handleApiResponse(response);
      
      // Update local storage
      const localData = localStorage.getItem(localStorageKey);
      const profiles: Profile[] = localData ? JSON.parse(localData) : [];
      localStorage.setItem(localStorageKey, JSON.stringify([...profiles, data]));
      
      toast.success(`Profile "${profile.name}" created successfully`);
      return normalizeProfile(data);
    } catch (error) {
      console.error("Failed to create profile on API, using local storage:", error);
      
      // Fallback to localStorage if API request fails
      const data = localStorage.getItem(localStorageKey);
      const profiles: Profile[] = data ? JSON.parse(data) : [];
      const newProfile = {
        ...profile,
        id: crypto.randomUUID() // Generate a UUID for the id
      };
      
      localStorage.setItem(localStorageKey, JSON.stringify([...profiles, newProfile]));
      toast.info(`Profile "${profile.name}" created locally (offline mode)`);
      return normalizeProfile(newProfile);
    }
  },

  // Update an existing profile
  updateProfile: async (id: number | string, profile: ProfileFormData): Promise<Profile> => {
    try {
      // Try to update on remote API first
      const response = await fetchWithTimeout(`${API_ENDPOINT}/profile/${id}`, {
        method: 'PUT',
        headers: { ...defaultHeaders },
        body: JSON.stringify(profile)
      });
      
      const data = await handleApiResponse(response);
      
      // Update local storage
      const localData = localStorage.getItem(localStorageKey);
      const profiles: Profile[] = localData ? JSON.parse(localData) : [];
      const updatedProfiles = profiles.map(p => p.id === id ? { ...profile, id } : p);
      localStorage.setItem(localStorageKey, JSON.stringify(updatedProfiles));
      
      toast.success(`Profile "${profile.name}" updated successfully`);
      return normalizeProfile(data);
    } catch (error) {
      console.error("Failed to update profile on API, using local storage:", error);
      
      // Fallback to localStorage if API request fails
      const data = localStorage.getItem(localStorageKey);
      const profiles: Profile[] = data ? JSON.parse(data) : [];
      const updatedProfiles = profiles.map(p => p.id === id ? { ...profile, id } : p);
      
      localStorage.setItem(localStorageKey, JSON.stringify(updatedProfiles));
      toast.info(`Profile "${profile.name}" updated locally (offline mode)`);
      return normalizeProfile({ ...profile, id });
    }
  },

  // Delete a profile
  deleteProfile: async (id: number | string): Promise<void> => {
    try {
      // Try to delete on remote API first
      const response = await fetchWithTimeout(`${API_ENDPOINT}/profile/${id}`, {
        method: 'DELETE',
        headers: { ...defaultHeaders }
      });
      
      await handleApiResponse(response);
      
      // Update local storage
      const data = localStorage.getItem(localStorageKey);
      const profiles: Profile[] = data ? JSON.parse(data) : [];
      const filteredProfiles = profiles.filter(p => p.id !== id);
      localStorage.setItem(localStorageKey, JSON.stringify(filteredProfiles));
      
      toast.success('Profile deleted successfully');
    } catch (error) {
      console.error("Failed to delete profile on API, using local storage:", error);
      
      // Fallback to localStorage if API request fails
      const data = localStorage.getItem(localStorageKey);
      const profiles: Profile[] = data ? JSON.parse(data) : [];
      const deletedProfile = profiles.find(p => p.id === id);
      const filteredProfiles = profiles.filter(p => p.id !== id);
      
      localStorage.setItem(localStorageKey, JSON.stringify(filteredProfiles));
      
      if (deletedProfile) {
        toast.info(`Profile "${deletedProfile.name}" deleted locally (offline mode)`);
      } else {
        toast.error('Profile not found or already deleted');
      }
    }
  }
};