
import { Profile, ProfileFormData } from "@/types";
import { toast } from "sonner";
import API_CONFIG from "@/config/api";
import { notionService } from "./notion";

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

// API service with methods
export const api = {
  // Initialize data (no need for initialization with the server)
  init: async () => {
    console.log('API service initialized with Notion integration');
  },

  // Get all profiles
  getProfiles: async (): Promise<Profile[]> => {
    try {
      console.log('Fetching profiles from Notion API...');
      const profiles = await notionService.getProfiles();
      console.log('Profiles retrieved successfully:', profiles.length);
      
      return profiles.map(normalizeProfile);
    } catch (error) {
      console.error('Failed to fetch profiles from Notion API:', error);
      toast.error(`Failed to load profiles: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return [];
    }
  },

  // Create a new profile
  createProfile: async (profile: ProfileFormData): Promise<Profile> => {
    try {
      // Generate a UUID for the new profile (Notion will actually assign its own ID)
      const newProfile = {
        ...profile,
      };
      
      // Send to Notion
      const createdProfile = await notionService.createProfile(newProfile);
      
      toast.success(`Profile "${profile.name}" created successfully`);
      return normalizeProfile(createdProfile);
    } catch (error) {
      console.error("Failed to create profile:", error);
      toast.error(`Failed to create profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  },

  // Update an existing profile
  updateProfile: async (id: number | string, profile: ProfileFormData): Promise<Profile> => {
    try {
      // Send to Notion
      const updatedProfile = await notionService.updateProfile(id, profile);
      
      toast.success(`Profile "${profile.name}" updated successfully`);
      return normalizeProfile(updatedProfile);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(`Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  },

  // Delete a profile
  deleteProfile: async (id: number | string): Promise<void> => {
    try {
      // Send to Notion
      await notionService.deleteProfile(id);
      
      toast.success(`Profile deleted successfully`);
    } catch (error) {
      console.error("Failed to delete profile:", error);
      toast.error(`Failed to delete profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
};
