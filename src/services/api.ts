
import { Profile, ProfileFormData } from "@/types";

// Mock API with localStorage persistence and remote API integration
const localStorageKey = 'profileAppData';
const API_ENDPOINT = 'http://192.168.50.84:3000';

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

// API service with methods to connect to the backend
export const api = {
  // Initialize data
  init: () => {
    initializeLocalStorage();
  },

  // Get all profiles
  getProfiles: async (): Promise<Profile[]> => {
    try {
      // Try to fetch from remote API first
      const response = await fetch(`${API_ENDPOINT}/profiles`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await handleApiResponse(response);
      // Store in localStorage as backup
      localStorage.setItem(localStorageKey, JSON.stringify(data));
      
      return data.map((profile: any) => normalizeProfile(profile));
    } catch (error) {
      console.error("Failed to fetch from API, using local data:", error);
      
      // Fallback to localStorage if API request fails
      const data = localStorage.getItem(localStorageKey);
      return (data ? JSON.parse(data) : []).map((profile: any) => normalizeProfile(profile));
    }
  },

  // Get a single profile
  getProfile: async (id: number | string): Promise<Profile | undefined> => {
    try {
      // Try to fetch from remote API first
      const response = await fetch(`${API_ENDPOINT}/profile/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await handleApiResponse(response);
      return normalizeProfile(data);
    } catch (error) {
      console.error("Failed to fetch profile from API, using local data:", error);
      
      // Fallback to localStorage if API request fails
      const data = localStorage.getItem(localStorageKey);
      const profiles: Profile[] = data ? JSON.parse(data) : [];
      const profile = profiles.find(p => p.id === id);
      return profile ? normalizeProfile(profile) : undefined;
    }
  },

  // Create a new profile
  createProfile: async (profile: ProfileFormData): Promise<Profile> => {
    try {
      // Try to create on remote API first
      const response = await fetch(`${API_ENDPOINT}/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      
      const data = await handleApiResponse(response);
      
      // Update local storage
      const localData = localStorage.getItem(localStorageKey);
      const profiles: Profile[] = localData ? JSON.parse(localData) : [];
      localStorage.setItem(localStorageKey, JSON.stringify([...profiles, data]));
      
      return normalizeProfile(data);
    } catch (error) {
      console.error("Failed to create profile on API, using local storage:", error);
      
      // Fallback to localStorage if API request fails
      const data = localStorage.getItem(localStorageKey);
      const profiles: Profile[] = data ? JSON.parse(data) : [];
      const newProfile = {
        ...profile,
        id: profiles.length > 0 ? Math.max(...profiles.map(p => typeof p.id === 'string' ? parseInt(p.id) : p.id as number)) + 1 : 1
      };
      
      localStorage.setItem(localStorageKey, JSON.stringify([...profiles, newProfile]));
      return normalizeProfile(newProfile);
    }
  },

  // Update an existing profile
  updateProfile: async (id: number | string, profile: ProfileFormData): Promise<Profile> => {
    try {
      // Try to update on remote API first
      const response = await fetch(`${API_ENDPOINT}/profile/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      
      const data = await handleApiResponse(response);
      
      // Update local storage
      const localData = localStorage.getItem(localStorageKey);
      const profiles: Profile[] = localData ? JSON.parse(localData) : [];
      const updatedProfiles = profiles.map(p => p.id === id ? { ...profile, id } : p);
      localStorage.setItem(localStorageKey, JSON.stringify(updatedProfiles));
      
      return normalizeProfile(data);
    } catch (error) {
      console.error("Failed to update profile on API, using local storage:", error);
      
      // Fallback to localStorage if API request fails
      const data = localStorage.getItem(localStorageKey);
      const profiles: Profile[] = data ? JSON.parse(data) : [];
      const updatedProfiles = profiles.map(p => p.id === id ? { ...profile, id } : p);
      
      localStorage.setItem(localStorageKey, JSON.stringify(updatedProfiles));
      return normalizeProfile({ ...profile, id });
    }
  },

  // Delete a profile
  deleteProfile: async (id: number | string): Promise<void> => {
    try {
      // Try to delete on remote API first
      const response = await fetch(`${API_ENDPOINT}/profile/${id}`, {
        method: 'DELETE'
      });
      
      await handleApiResponse(response);
      
      // Update local storage
      const data = localStorage.getItem(localStorageKey);
      const profiles: Profile[] = data ? JSON.parse(data) : [];
      const filteredProfiles = profiles.filter(p => p.id !== id);
      localStorage.setItem(localStorageKey, JSON.stringify(filteredProfiles));
    } catch (error) {
      console.error("Failed to delete profile on API, using local storage:", error);
      
      // Fallback to localStorage if API request fails
      const data = localStorage.getItem(localStorageKey);
      const profiles: Profile[] = data ? JSON.parse(data) : [];
      const filteredProfiles = profiles.filter(p => p.id !== id);
      
      localStorage.setItem(localStorageKey, JSON.stringify(filteredProfiles));
    }
  }
};
