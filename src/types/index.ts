
export interface Profile {
  id: number;
  name: string;
  photo_url: string;
  bra_size?: string;
  measurement_1?: number;
  measurement_2?: number;
  measurement_3?: number;
  instagram_url?: string;
  twitter_url?: string;
  tiktok_url?: string;
}

export interface ProfileFormData {
  name: string;
  photo_url: string;
  bra_size?: string;
  measurement_1?: number;
  measurement_2?: number;
  measurement_3?: number;
  instagram_url?: string;
  twitter_url?: string;
  tiktok_url?: string;
}
