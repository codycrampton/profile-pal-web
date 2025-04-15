
export interface Profile {
  id: number | string;
  name: string;
  photo_url: string;
  braSize?: string;
  bra_size?: string; // For backward compatibility
  measurement_1?: number;
  measurement_2?: number;
  measurement_3?: number;
  bust?: number | string;
  waist?: number | string;
  hips?: number | string;
  instagram_url?: string;
  instagram?: string;
  twitter_url?: string;
  twitter?: string;
  tiktok_url?: string;
  tiktok?: string;
  babepedia?: string;
  imageURL?: string;
  isFictional?: number;
  work?: string;
  wikiURL?: string;
  notes?: string;
  isMetric?: number;
  traits?: string;
  hairColor?: string;
  height?: number;
  weight?: number;
  underbust?: number;
  threads?: string;
}

export interface ProfileFormData {
  name: string;
  photo_url: string;
  braSize?: string;
  bra_size?: string;
  measurement_1?: number;
  measurement_2?: number;
  measurement_3?: number;
  bust?: number | string;
  waist?: number | string;
  hips?: number | string;
  instagram_url?: string;
  instagram?: string;
  twitter_url?: string;
  twitter?: string;
  tiktok_url?: string;
  tiktok?: string;
  babepedia?: string;
  imageURL?: string;
  isFictional?: number;
  work?: string;
  wikiURL?: string;
  notes?: string;
  isMetric?: number;
  traits?: string;
  hairColor?: string;
  height?: number;
  weight?: number;
  underbust?: number;
  threads?: string;
}

export type SortField = 
  | 'name' 
  | 'braSize' 
  | 'bra_size'
  | 'measurement_1' 
  | 'bust'
  | 'height'
  | 'traits';

export type SortDirection = 'asc' | 'desc';

export type GridSize = 1 | 2 | 3 | 4;

export interface FilterOptions {
  isFictional?: number;
  traits?: string;
  hairColor?: string;
}
