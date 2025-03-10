
export type SearchResult = {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'doctor' | 'appointment' | 'record';
  url: string;
};
