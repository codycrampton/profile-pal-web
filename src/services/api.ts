import { Profile, ProfileFormData } from "@/types";
import { toast } from "sonner";
import API_CONFIG from "@/config/api";

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
  // Initialize data
  init: async () => {
    console.log('API service initialized');
  },

  // Get all profiles
  getProfiles: async (): Promise<Profile[]> => {
    try {
      console.log('Fetching profiles from API...');
      const response = await fetch(`${API_CONFIG.endpoint}/api/profiles`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Profiles retrieved successfully:', data.length);
      
      return data.map(normalizeProfile);
    } catch (error) {
      console.error('Failed to fetch profiles:', error);
      toast.error(`Failed to load profiles: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return [];
    }
  },

  // Create a new profile
  createProfile: async (profile: ProfileFormData): Promise<Profile> => {
    try {
      const response = await fetch(`${API_CONFIG.endpoint}/api/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: {
            Name: {
              title: [{ text: { content: profile.name } }]
            },
            'Bra Size': {
              rich_text: [{ text: { content: profile.bra_size || profile.braSize || '' } }]
            },
            Bust: {
              number: Number(profile.bust || profile.measurement_1 || 0)
            },
            Waist: {
              number: Number(profile.waist || profile.measurement_2 || 0)
            },
            Hips: {
              number: Number(profile.hips || profile.measurement_3 || 0)
            },
            Instagram: {
              url: profile.instagram || profile.instagram_url || null
            },
            Twitter: {
              url: profile.twitter || profile.twitter_url || null
            },
            TikTok: {
              url: profile.tiktok || profile.tiktok_url || null
            },
            'Photo URL': {
              url: profile.photo_url || profile.imageURL || null
            },
            Fictional: {
              checkbox: profile.isFictional === 1
            },
            Work: {
              rich_text: [{ text: { content: profile.work || '' } }]
            },
            'Wiki URL': {
              url: profile.wikiURL || null
            },
            Notes: {
              rich_text: [{ text: { content: profile.notes || '' } }]
            },
            'Is Metric': {
              checkbox: profile.isMetric === 1
            },
            Traits: {
              rich_text: [{ text: { content: profile.traits || '' } }]
            },
            'Hair Color': {
              rich_text: [{ text: { content: profile.hairColor || '' } }]
            },
            Height: {
              number: Number(profile.height || 0)
            },
            Weight: {
              number: Number(profile.weight || 0)
            },
            Underbust: {
              number: Number(profile.underbust || 0)
            },
            Threads: {
              url: profile.threads || null
            }
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      toast.success(`Profile "${profile.name}" created successfully`);
      return normalizeProfile(data);
    } catch (error) {
      console.error("Failed to create profile:", error);
      toast.error(`Failed to create profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  },

  // Update an existing profile
  updateProfile: async (id: number | string, profile: ProfileFormData): Promise<Profile> => {
    try {
      const response = await fetch(`${API_CONFIG.endpoint}/api/profiles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: {
            Name: {
              title: [{ text: { content: profile.name } }]
            },
            'Bra Size': {
              rich_text: [{ text: { content: profile.bra_size || profile.braSize || '' } }]
            },
            Bust: {
              number: Number(profile.bust || profile.measurement_1 || 0)
            },
            Waist: {
              number: Number(profile.waist || profile.measurement_2 || 0)
            },
            Hips: {
              number: Number(profile.hips || profile.measurement_3 || 0)
            },
            Instagram: {
              url: profile.instagram || profile.instagram_url || null
            },
            Twitter: {
              url: profile.twitter || profile.twitter_url || null
            },
            TikTok: {
              url: profile.tiktok || profile.tiktok_url || null
            },
            'Photo URL': {
              url: profile.photo_url || profile.imageURL || null
            },
            Fictional: {
              checkbox: profile.isFictional === 1
            },
            Work: {
              rich_text: [{ text: { content: profile.work || '' } }]
            },
            'Wiki URL': {
              url: profile.wikiURL || null
            },
            Notes: {
              rich_text: [{ text: { content: profile.notes || '' } }]
            },
            'Is Metric': {
              checkbox: profile.isMetric === 1
            },
            Traits: {
              rich_text: [{ text: { content: profile.traits || '' } }]
            },
            'Hair Color': {
              rich_text: [{ text: { content: profile.hairColor || '' } }]
            },
            Height: {
              number: Number(profile.height || 0)
            },
            Weight: {
              number: Number(profile.weight || 0)
            },
            Underbust: {
              number: Number(profile.underbust || 0)
            },
            Threads: {
              url: profile.threads || null
            }
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      toast.success(`Profile "${profile.name}" updated successfully`);
      return normalizeProfile(data);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(`Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  },

  // Delete a profile
  deleteProfile: async (id: number | string): Promise<void> => {
    try {
      const response = await fetch(`${API_CONFIG.endpoint}/api/profiles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success(`Profile deleted successfully`);
    } catch (error) {
      console.error("Failed to delete profile:", error);
      toast.error(`Failed to delete profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
};
