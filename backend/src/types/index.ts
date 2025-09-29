export interface IReview {
  _id?: string;
  name: string;
  rating: number;
  date: string;
  text: string;
}

export interface ITennisCourt {
  _id?: string;
  id: number;
  name: string;
  location: string;
  address: string;
  surface: 'Hard' | 'Clay' | 'Grass';
  price: string;
  hours: string;
  amenities: string[];
  rating: number;
  reviewCount: number;
  description: string;
  reviews: IReview[];
}

export interface FilterOptions {
  rating?: string;
  surface?: string;
  search?: string;
}
