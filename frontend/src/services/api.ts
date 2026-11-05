import axios from 'axios';
import {
  User,
  ScanResult,
  ProductCatalogItem,
  DailyDiaryData,
  WeeklySummaryData,
  Complaint
} from '../types';

const API_BASE_URL = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token into requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('labellens_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Functions
export const api = {
  // Auth
  async register(data: any): Promise<{ access_token: string; user: User }> {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
  },

  async login(data: any): Promise<{ access_token: string; user: User }> {
    const res = await apiClient.post('/auth/login', data);
    return res.data;
  },

  async getMe(): Promise<User> {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  async updateProfile(data: any): Promise<User> {
    const res = await apiClient.put('/auth/profile', data);
    return res.data;
  },

  // Scan & OCR
  async uploadOcrImage(formData: FormData): Promise<any> {
    const res = await apiClient.post('/scan/ocr', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async analyzeLabel(payload: {
    product_name?: string;
    ingredients_text: string;
    nutrition_facts?: Record<string, number>;
    fssai_license?: string;
  }): Promise<ScanResult> {
    const res = await apiClient.post('/scan/analyze', payload);
    return res.data;
  },

  async explainScore(payload: {
    product_name: string;
    overall_score: number;
    safety_score?: number;
    nutrition_score?: number;
    concern_level?: string;
    nutrition_facts?: Record<string, any>;
    ingredient_analysis?: any;
    fssai_license?: string | null;
    processing_level?: string | null;
  }): Promise<any> {
    const res = await apiClient.post('/scan/explain-score', payload);
    return res.data;
  },

  async getScanHistory(): Promise<any[]> {
    const res = await apiClient.get('/scan/history');
    return res.data;
  },

  async getScanDetail(scanId: number): Promise<ScanResult> {
    const res = await apiClient.get(`/scan/history/${scanId}`);
    return res.data;
  },

  // Products
  async getProducts(params?: { q?: string; category?: string; limit?: number }): Promise<ProductCatalogItem[]> {
    const res = await apiClient.get('/products', { params });
    return res.data;
  },

  async getProductById(id: number): Promise<any> {
    const res = await apiClient.get(`/products/${id}`);
    return res.data;
  },

  async getProductByBarcode(code: string): Promise<any> {
    const res = await apiClient.get(`/products/barcode/${code}`);
    return res.data;
  },

  async compareProducts(productIds: number[]): Promise<any> {
    const res = await apiClient.post('/products/compare', { product_ids: productIds });
    return res.data;
  },

  async saveProduct(id: number): Promise<any> {
    const res = await apiClient.post(`/products/save/${id}`);
    return res.data;
  },

  async removeSavedProduct(id: number): Promise<any> {
    const res = await apiClient.delete(`/products/save/${id}`);
    return res.data;
  },

  async getSavedProducts(): Promise<ProductCatalogItem[]> {
    const res = await apiClient.get('/products/user/saved');
    return res.data;
  },

  // Nutrition Diary
  async getDailyDiary(day?: string): Promise<DailyDiaryData> {
    const res = await apiClient.get('/diary/day', { params: { day } });
    return res.data;
  },

  async addMealEntry(payload: any): Promise<any> {
    const res = await apiClient.post('/diary/entry', payload);
    return res.data;
  },

  async deleteMealEntry(id: number): Promise<any> {
    const res = await apiClient.delete(`/diary/entry/${id}`);
    return res.data;
  },

  async getWeeklySummary(): Promise<WeeklySummaryData> {
    const res = await apiClient.get('/diary/weekly-summary');
    return res.data;
  },

  // Complaints
  async uploadComplaintEvidence(formData: FormData): Promise<any> {
    const res = await apiClient.post('/complaints/upload-evidence', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async submitComplaint(data: any): Promise<any> {
    const res = await apiClient.post('/complaints', data);
    return res.data;
  },

  async getUserComplaints(): Promise<Complaint[]> {
    const res = await apiClient.get('/complaints/user/my-complaints');
    return res.data;
  },

  async trackComplaint(referenceNumber: string): Promise<any> {
    const res = await apiClient.get(`/complaints/track/${referenceNumber}`);
    return res.data;
  },

  async getFssaiGuidance(): Promise<any> {
    const res = await apiClient.get('/complaints/fssai-guidance');
    return res.data;
  },

  // AI Assistant
  async chatAssistant(payload: {
    message: string;
    history?: Array<{ role: string; content: string }>;
    active_product?: any;
  }): Promise<{ reply: string; source: string }> {
    const res = await apiClient.post('/assistant/chat', payload);
    return res.data;
  },

  async estimateMeal(foodDescription: string): Promise<any> {
    const res = await apiClient.post('/assistant/estimate-meal', null, {
      params: { food_description: foodDescription },
    });
    return res.data;
  },

  // Admin
  async getAdminStats(): Promise<any> {
    const res = await apiClient.get('/admin/stats');
    return res.data;
  },

  async getAdminComplaints(status?: string, category?: string): Promise<any[]> {
    const res = await apiClient.get('/admin/complaints', { params: { status, category } });
    return res.data;
  },

  async updateComplaintStatus(id: number, payload: { status: string; admin_notes?: string }): Promise<any> {
    const res = await apiClient.put(`/admin/complaints/${id}/status`, payload);
    return res.data;
  },

  async toggleProductVerification(id: number, isVerified: boolean): Promise<any> {
    const res = await apiClient.put(`/admin/products/${id}/verify`, null, {
      params: { is_verified: isVerified },
    });
    return res.data;
  },

  // Live India Food Safety News
  async getFoodNews(forceRefresh = false): Promise<any> {
    const res = await apiClient.get('/news', {
      params: forceRefresh ? { force_refresh: true } : {},
    });
    return res.data;
  },
};
