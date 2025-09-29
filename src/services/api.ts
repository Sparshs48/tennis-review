const API_BASE_URL = 'http://localhost:5000/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
}

export interface TennisCourt {
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
  reviews: Review[];
}

export interface Review {
  _id?: string;
  name: string;
  rating: number;
  date: string;
  text: string;
}

export interface FilterOptions {
  search?: string;
  surface?: string;
  rating?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // Courts API
  async getCourts(filters?: FilterOptions): Promise<TennisCourt[]> {
    const queryParams = new URLSearchParams();
    
    if (filters?.search) queryParams.append('search', filters.search);
    if (filters?.surface) queryParams.append('surface', filters.surface);
    if (filters?.rating) queryParams.append('rating', filters.rating);
    
    const queryString = queryParams.toString();
    const endpoint = `/courts${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.request<{ data: TennisCourt[] }>(endpoint);
    return response.data || [];
  }

  async getCourtById(id: number): Promise<TennisCourt> {
    const response = await this.request<{ data: TennisCourt }>(`/courts/${id}`);
    if (!response.data) {
      throw new Error('Court not found');
    }
    return response.data;
  }

  async createCourt(court: Omit<TennisCourt, '_id'>): Promise<TennisCourt> {
    const response = await this.request<{ data: TennisCourt }>('/courts', {
      method: 'POST',
      body: JSON.stringify(court),
    });
    if (!response.data) {
      throw new Error('Failed to create court');
    }
    return response.data;
  }

  async updateCourt(id: number, court: Partial<TennisCourt>): Promise<TennisCourt> {
    const response = await this.request<{ data: TennisCourt }>(`/courts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(court),
    });
    if (!response.data) {
      throw new Error('Failed to update court');
    }
    return response.data;
  }

  async deleteCourt(id: number): Promise<void> {
    await this.request(`/courts/${id}`, {
      method: 'DELETE',
    });
  }

  // Reviews API
  async addReview(courtId: number, review: Omit<Review, '_id' | 'date'>): Promise<{ court: TennisCourt; newReview: Review }> {
    const response = await this.request<{ data: { court: TennisCourt; newReview: Review } }>(`/courts/${courtId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    });
    if (!response.data) {
      throw new Error('Failed to add review');
    }
    return response.data;
  }

  async getReviewsByCourt(courtId: number): Promise<Review[]> {
    const response = await this.request<{ data: Review[] }>(`/courts/${courtId}/reviews`);
    return response.data || [];
  }

  async updateReview(reviewId: string, review: Partial<Review>): Promise<Review> {
    const response = await this.request<{ data: Review }>(`/courts/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(review),
    });
    if (!response.data) {
      throw new Error('Failed to update review');
    }
    return response.data;
  }

  async deleteReview(reviewId: string): Promise<void> {
    await this.request(`/courts/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<{ success: boolean; message: string; timestamp: string }> {
    const response = await this.request<{ success: boolean; message: string; timestamp: string }>('/health');
    return response;
  }
}

export const apiService = new ApiService();
