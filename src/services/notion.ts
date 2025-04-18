
import { Client } from "@notionhq/client";
import { Profile } from "@/types";
import API_CONFIG from "@/config/api";

// Initialize Notion client
const notion = new Client({
  auth: API_CONFIG.notion.apiKey,
});

// Helper function to extract property value based on its type
const getPropertyValue = (property: any): any => {
  if (!property) return null;
  
  if (property.type === 'title' && property.title?.[0]?.plain_text) {
    return property.title[0].plain_text;
  } else if (property.type === 'rich_text' && property.rich_text?.[0]?.plain_text) {
    return property.rich_text[0].plain_text;
  } else if (property.type === 'url') {
    return property.url;
  } else if (property.type === 'number') {
    return property.number;
  } else if (property.type === 'select' && property.select?.name) {
    return property.select.name;
  } else if (property.type === 'multi_select') {
    return property.multi_select?.map((item: any) => item.name).join(';');
  } else if (property.type === 'checkbox') {
    return property.checkbox ? 1 : 0;
  }
  
  return null;
};

// Convert Notion page to Profile format
const mapPageToProfile = (page: any): Profile => {
  const properties = page.properties;

  return {
    id: page.id,
    name: getPropertyValue(properties.Name),
    bra_size: getPropertyValue(properties['Bra Size']),
    braSize: getPropertyValue(properties['Bra Size']),
    measurement_1: getPropertyValue(properties.Bust),
    measurement_2: getPropertyValue(properties.Waist),
    measurement_3: getPropertyValue(properties.Hips),
    bust: getPropertyValue(properties.Bust),
    waist: getPropertyValue(properties.Waist),
    hips: getPropertyValue(properties.Hips),
    instagram: getPropertyValue(properties.Instagram),
    instagram_url: getPropertyValue(properties.Instagram),
    twitter: getPropertyValue(properties.Twitter),
    twitter_url: getPropertyValue(properties.Twitter),
    tiktok: getPropertyValue(properties.TikTok),
    tiktok_url: getPropertyValue(properties.TikTok),
    babepedia: getPropertyValue(properties.Babepedia),
    photo_url: getPropertyValue(properties['Photo URL']),
    imageURL: getPropertyValue(properties['Photo URL']),
    isFictional: getPropertyValue(properties.Fictional),
    work: getPropertyValue(properties.Work),
    wikiURL: getPropertyValue(properties['Wiki URL']),
    notes: getPropertyValue(properties.Notes),
    isMetric: getPropertyValue(properties['Is Metric']),
    traits: getPropertyValue(properties.Traits),
    hairColor: getPropertyValue(properties['Hair Color']),
    height: getPropertyValue(properties.Height),
    weight: getPropertyValue(properties.Weight),
    underbust: getPropertyValue(properties.Underbust),
    threads: getPropertyValue(properties.Threads)
  };
};

export const notionService = {
  getProfiles: async (): Promise<Profile[]> => {
    try {
      const response = await notion.databases.query({
        database_id: API_CONFIG.notion.databaseId,
        sorts: [
          {
            property: "Name",
            direction: "ascending",
          },
        ],
      });

      const profiles = response.results.map(mapPageToProfile);
      return profiles;
    } catch (error) {
      console.error("Error fetching from Notion:", error);
      throw error;
    }
  },

  createProfile: async (profile: any): Promise<Profile> => {
    try {
      const properties: any = {
        Name: {
          title: [{ text: { content: profile.name } }]
        }
      };

      // Map profile properties to Notion properties
      if (profile.bra_size || profile.braSize) {
        properties['Bra Size'] = {
          rich_text: [{ text: { content: profile.bra_size || profile.braSize || '' } }]
        };
      }
      
      if (profile.bust || profile.measurement_1) {
        properties['Bust'] = {
          number: Number(profile.bust || profile.measurement_1 || 0)
        };
      }
      
      if (profile.waist || profile.measurement_2) {
        properties['Waist'] = {
          number: Number(profile.waist || profile.measurement_2 || 0)
        };
      }
      
      if (profile.hips || profile.measurement_3) {
        properties['Hips'] = {
          number: Number(profile.hips || profile.measurement_3 || 0)
        };
      }
      
      if (profile.instagram || profile.instagram_url) {
        properties['Instagram'] = {
          url: profile.instagram || profile.instagram_url || null
        };
      }
      
      if (profile.twitter || profile.twitter_url) {
        properties['Twitter'] = {
          url: profile.twitter || profile.twitter_url || null
        };
      }
      
      if (profile.tiktok || profile.tiktok_url) {
        properties['TikTok'] = {
          url: profile.tiktok || profile.tiktok_url || null
        };
      }
      
      if (profile.babepedia) {
        properties['Babepedia'] = {
          url: profile.babepedia || null
        };
      }
      
      if (profile.photo_url || profile.imageURL) {
        properties['Photo URL'] = {
          url: profile.photo_url || profile.imageURL || null
        };
      }
      
      if (profile.isFictional !== undefined) {
        properties['Fictional'] = {
          checkbox: profile.isFictional === 1
        };
      }
      
      if (profile.work) {
        properties['Work'] = {
          rich_text: [{ text: { content: profile.work } }]
        };
      }
      
      if (profile.wikiURL) {
        properties['Wiki URL'] = {
          url: profile.wikiURL || null
        };
      }
      
      if (profile.notes) {
        properties['Notes'] = {
          rich_text: [{ text: { content: profile.notes } }]
        };
      }
      
      if (profile.isMetric !== undefined) {
        properties['Is Metric'] = {
          checkbox: profile.isMetric === 1
        };
      }
      
      if (profile.traits) {
        const traits = profile.traits.split(';').map((trait: string) => ({ name: trait.trim() }));
        properties['Traits'] = {
          multi_select: traits
        };
      }
      
      if (profile.hairColor) {
        properties['Hair Color'] = {
          rich_text: [{ text: { content: profile.hairColor } }]
        };
      }
      
      if (profile.height) {
        properties['Height'] = {
          number: Number(profile.height || 0)
        };
      }
      
      if (profile.weight) {
        properties['Weight'] = {
          number: Number(profile.weight || 0)
        };
      }
      
      if (profile.underbust) {
        properties['Underbust'] = {
          number: Number(profile.underbust || 0)
        };
      }
      
      if (profile.threads) {
        properties['Threads'] = {
          url: profile.threads || null
        };
      }

      const response = await notion.pages.create({
        parent: { database_id: API_CONFIG.notion.databaseId },
        properties
      });

      return mapPageToProfile(response);
    } catch (error) {
      console.error("Error creating profile in Notion:", error);
      throw error;
    }
  },

  updateProfile: async (id: string | number, profile: any): Promise<Profile> => {
    try {
      const properties: any = {};
      
      // Map profile properties to Notion properties
      if (profile.name) {
        properties['Name'] = {
          title: [{ text: { content: profile.name } }]
        };
      }
      
      if (profile.bra_size || profile.braSize) {
        properties['Bra Size'] = {
          rich_text: [{ text: { content: profile.bra_size || profile.braSize || '' } }]
        };
      }
      
      if (profile.bust || profile.measurement_1) {
        properties['Bust'] = {
          number: Number(profile.bust || profile.measurement_1 || 0)
        };
      }
      
      if (profile.waist || profile.measurement_2) {
        properties['Waist'] = {
          number: Number(profile.waist || profile.measurement_2 || 0)
        };
      }
      
      if (profile.hips || profile.measurement_3) {
        properties['Hips'] = {
          number: Number(profile.hips || profile.measurement_3 || 0)
        };
      }
      
      if (profile.instagram || profile.instagram_url) {
        properties['Instagram'] = {
          url: profile.instagram || profile.instagram_url || null
        };
      }
      
      if (profile.twitter || profile.twitter_url) {
        properties['Twitter'] = {
          url: profile.twitter || profile.twitter_url || null
        };
      }
      
      if (profile.tiktok || profile.tiktok_url) {
        properties['TikTok'] = {
          url: profile.tiktok || profile.tiktok_url || null
        };
      }
      
      if (profile.babepedia) {
        properties['Babepedia'] = {
          url: profile.babepedia || null
        };
      }
      
      if (profile.photo_url || profile.imageURL) {
        properties['Photo URL'] = {
          url: profile.photo_url || profile.imageURL || null
        };
      }
      
      if (profile.isFictional !== undefined) {
        properties['Fictional'] = {
          checkbox: profile.isFictional === 1
        };
      }
      
      if (profile.work) {
        properties['Work'] = {
          rich_text: [{ text: { content: profile.work } }]
        };
      }
      
      if (profile.wikiURL) {
        properties['Wiki URL'] = {
          url: profile.wikiURL || null
        };
      }
      
      if (profile.notes) {
        properties['Notes'] = {
          rich_text: [{ text: { content: profile.notes } }]
        };
      }
      
      if (profile.isMetric !== undefined) {
        properties['Is Metric'] = {
          checkbox: profile.isMetric === 1
        };
      }
      
      if (profile.traits) {
        const traits = profile.traits.split(';').map((trait: string) => ({ name: trait.trim() }));
        properties['Traits'] = {
          multi_select: traits
        };
      }
      
      if (profile.hairColor) {
        properties['Hair Color'] = {
          rich_text: [{ text: { content: profile.hairColor } }]
        };
      }
      
      if (profile.height) {
        properties['Height'] = {
          number: Number(profile.height || 0)
        };
      }
      
      if (profile.weight) {
        properties['Weight'] = {
          number: Number(profile.weight || 0)
        };
      }
      
      if (profile.underbust) {
        properties['Underbust'] = {
          number: Number(profile.underbust || 0)
        };
      }
      
      if (profile.threads) {
        properties['Threads'] = {
          url: profile.threads || null
        };
      }

      const response = await notion.pages.update({
        page_id: String(id),
        properties
      });

      return mapPageToProfile(response);
    } catch (error) {
      console.error("Error updating profile in Notion:", error);
      throw error;
    }
  },

  deleteProfile: async (id: string | number): Promise<void> => {
    try {
      await notion.pages.update({
        page_id: String(id),
        archived: true
      });
    } catch (error) {
      console.error("Error deleting profile from Notion:", error);
      throw error;
    }
  }
};
