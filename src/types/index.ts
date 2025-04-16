
export interface Profile {
  id: string | number;
  name: string;
  braSize?: string | null;
  bra_size?: string | null;
  bust?: number | string;
  waist?: number | string;
  hips?: number | string;
  measurement_1?: number | string;
  measurement_2?: number | string;
  measurement_3?: number | string;
  instagram?: string;
  instagram_url?: string;
  twitter?: string;
  twitter_url?: string;
  tiktok?: string;
  tiktok_url?: string;
  babepedia?: string;
  photo_url?: string;
  imageURL?: string;
  isFictional?: number;
  work?: string;
  wikiURL?: string;
  notes?: string;
  isMetric?: number;
  traits?: string;
  hairColor?: string | null;
  height?: number;
  weight?: number | null;
  underbust?: number;
  threads?: string | null;
}

// This type is used for the form when creating/editing profiles
export type ProfileFormData = Omit<Profile, 'id'>;

export type SortField = 
  | 'name' 
  | 'braSize' 
  | 'bust' 
  | 'waist' 
  | 'hips' 
  | 'height' 
  | 'isFictional';

export type SortDirection = 'asc' | 'desc';

export type GridSize = 1 | 2 | 3 | 4 | 5 | 6;

export interface FilterOptions {
  isFictional?: number;
  traits?: string;
  hairColor?: string;
}
