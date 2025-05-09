
export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  years_of_experience: number;
  rating: number;
  availability: boolean;
  image_url: string | null;
  keywords: string[];
  created_at: string;
}
