
import { Profile, ProfileFormData } from "@/types";

// This is mocked data for development - will be replaced with real API calls
const MOCK_PROFILES: Profile[] = [
  {
    id: 1,
    name: "Komoe Tsukuyomi",
    photo_url: "https://via.placeholder.com/300x450",
    bra_size: "32B",
    instagram_url: "https://instagram.com/komoe",
    twitter_url: "https://twitter.com/komoe",
  },
  {
    id: 2,
    name: "Miyuki Shirogane",
    photo_url: "https://via.placeholder.com/300x450",
    measurement_1: 90,
    measurement_2: 60,
    measurement_3: 88,
    tiktok_url: "https://tiktok.com/@miyuki",
  },
  {
    id: 3,
    name: "Ai Hoshino",
    photo_url: "https://via.placeholder.com/300x450",
    bra_size: "34C",
    twitter_url: "https://twitter.com/aihoshino",
  }
];

// Mock API with localStorage persistence
const localStorageKey = 'profileAppData';

// Initialize localStorage with mock data if empty
const initializeLocalStorage = () => {
  const existingData = localStorage.getItem(localStorageKey);
  if (!existingData) {
    localStorage.setItem(localStorageKey, JSON.stringify(MOCK_PROFILES));
  }
};

// API service with methods that would connect to your actual backend
export const api = {
  // Initialize data
  init: () => {
    initializeLocalStorage();
  },

  // Get all profiles
  getProfiles: async (): Promise<Profile[]> => {
    // In production, this would be: return fetch('http://192.168.50.84/profiles').then(res => res.json());
    const data = localStorage.getItem(localStorageKey);
    return Promise.resolve(data ? JSON.parse(data) : []);
  },

  // Get a single profile
  getProfile: async (id: number): Promise<Profile | undefined> => {
    // In production: return fetch(`http://192.168.50.84/profile/${id}`).then(res => res.json());
    const data = localStorage.getItem(localStorageKey);
    const profiles: Profile[] = data ? JSON.parse(data) : [];
    return Promise.resolve(profiles.find(p => p.id === id));
  },

  // Search for profiles by name (fuzzy)
  searchProfiles: async (query: string): Promise<Profile[]> => {
    // In production: return fetch(`http://192.168.50.84/profile?name=${query}`).then(res => res.json());
    // For now we'll implement fuzzy search client-side in a separate utility
    return api.getProfiles();
  },

  // Create a new profile
  createProfile: async (profile: ProfileFormData): Promise<Profile> => {
    // In production: return fetch('http://192.168.50.84/profile', { method: 'POST', body: JSON.stringify(profile) }).then(res => res.json());
    const data = localStorage.getItem(localStorageKey);
    const profiles: Profile[] = data ? JSON.parse(data) : [];
    const newProfile = {
      ...profile,
      id: profiles.length > 0 ? Math.max(...profiles.map(p => p.id)) + 1 : 1
    };
    
    localStorage.setItem(localStorageKey, JSON.stringify([...profiles, newProfile]));
    return Promise.resolve(newProfile);
  },

  // Update an existing profile
  updateProfile: async (id: number, profile: ProfileFormData): Promise<Profile> => {
    // In production: return fetch(`http://192.168.50.84/profile/${id}`, { method: 'PUT', body: JSON.stringify(profile) }).then(res => res.json());
    const data = localStorage.getItem(localStorageKey);
    const profiles: Profile[] = data ? JSON.parse(data) : [];
    const updatedProfiles = profiles.map(p => p.id === id ? { ...profile, id } : p);
    
    localStorage.setItem(localStorageKey, JSON.stringify(updatedProfiles));
    return Promise.resolve({ ...profile, id });
  },

  // Delete a profile
  deleteProfile: async (id: number): Promise<void> => {
    // In production: return fetch(`http://192.168.50.84/profile/${id}`, { method: 'DELETE' }).then(res => res.json());
    const data = localStorage.getItem(localStorageKey);
    const profiles: Profile[] = data ? JSON.parse(data) : [];
    const filteredProfiles = profiles.filter(p => p.id !== id);
    
    localStorage.setItem(localStorageKey, JSON.stringify(filteredProfiles));
    return Promise.resolve();
  }
};
