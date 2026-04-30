import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// Detect API base URL based on environment
const getApiBaseUrl = (): string => {
  // Check for environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Runtime detection for deployment platforms
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    
    // Railway detection
    if (hostname.includes('railway.app') || hostname.includes('up.railway.app')) {
      return `${protocol}//${hostname}`;
    }
    
    // Render detection
    if (hostname.includes('onrender.com')) {
      return `${protocol}//${hostname}`;
    }
    
    // Vercel detection
    if (hostname.includes('vercel.app')) {
      return `${protocol}//${hostname}`;
    }
    
    // Netlify detection
    if (hostname.includes('netlify.app')) {
      return `${protocol}//${hostname}`;
    }
    
    // Heroku detection
    if (hostname.includes('herokuapp.com')) {
      return `${protocol}//${hostname}`;
    }
    
    // Production custom domain
    if (import.meta.env.PROD && !hostname.includes('localhost')) {
      return `${protocol}//${hostname}`;
    }
  }

  // Local development fallback
  return 'http://localhost:8000';
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Disabled - using token-based auth, not cookies
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add timestamp to prevent caching
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Forbidden
      console.error('Access forbidden');
    } else if (error.response?.status === 404) {
      console.error('Resource not found');
    } else if (error.response?.status === 500) {
      console.error('Server error');
    }

    return Promise.reject(error);
  }
);

// API Service Classes
export class AuthAPI {
  static async login(email: string, password: string) {
    return apiClient.post('/login', { email, password });
  }

  static async logout() {
    return apiClient.post('/logout');
  }

  static async getUser() {
    return apiClient.get('/user');
  }

  static async register(data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) {
    return apiClient.post('/register', data);
  }
}

export class DashboardAPI {
  static async getStats() {
    return apiClient.get('/dashboard/stats');
  }

  static async getCharts() {
    return apiClient.get('/dashboard/charts');
  }
}

export class InventoryAPI {
  static async getItems(params?: any) {
    return apiClient.get('/items', { params });
  }

  static async getItem(id: number) {
    return apiClient.get(`/items/${id}`);
  }

  static async createItem(data: any) {
    return apiClient.post('/items', data);
  }

  static async updateItem(id: number, data: any) {
    return apiClient.put(`/items/${id}`, data);
  }

  static async deleteItem(id: number) {
    return apiClient.delete(`/items/${id}`);
  }
}

export class CategoryAPI {
  static async getCategories(params?: any) {
    return apiClient.get('/categories', { params });
  }

  static async getCategory(id: number) {
    return apiClient.get(`/categories/${id}`);
  }

  static async createCategory(data: any) {
    return apiClient.post('/categories', data);
  }

  static async updateCategory(id: number, data: any) {
    return apiClient.put(`/categories/${id}`, data);
  }

  static async deleteCategory(id: number) {
    return apiClient.delete(`/categories/${id}`);
  }
}

export class SupplierAPI {
  static async getSuppliers(params?: any) {
    return apiClient.get('/suppliers', { params });
  }

  static async getSupplier(id: number) {
    return apiClient.get(`/suppliers/${id}`);
  }

  static async createSupplier(data: any) {
    return apiClient.post('/suppliers', data);
  }

  static async updateSupplier(id: number, data: any) {
    return apiClient.put(`/suppliers/${id}`, data);
  }

  static async deleteSupplier(id: number) {
    return apiClient.delete(`/suppliers/${id}`);
  }
}

export class PurchaseOrderAPI {
  static async getPurchaseOrders(params?: any) {
    return apiClient.get('/purchase-orders', { params });
  }

  static async getPurchaseOrder(id: number) {
    return apiClient.get(`/purchase-orders/${id}`);
  }

  static async createPurchaseOrder(data: any) {
    return apiClient.post('/purchase-orders', data);
  }

  static async updatePurchaseOrder(id: number, data: any) {
    return apiClient.put(`/purchase-orders/${id}`, data);
  }

  static async deletePurchaseOrder(id: number) {
    return apiClient.delete(`/purchase-orders/${id}`);
  }

  static async approvePurchaseOrder(id: number) {
    return apiClient.post(`/purchase-orders/${id}/approve`);
  }
}

export class RequisitionAPI {
  static async getRequisitions(params?: any) {
    return apiClient.get('/requisitions', { params });
  }

  static async getRequisition(id: number) {
    return apiClient.get(`/requisitions/${id}`);
  }

  static async createRequisition(data: any) {
    return apiClient.post('/requisitions', data);
  }

  static async updateRequisition(id: number, data: any) {
    return apiClient.put(`/requisitions/${id}`, data);
  }

  static async deleteRequisition(id: number) {
    return apiClient.delete(`/requisitions/${id}`);
  }

  static async approveRequisition(id: number) {
    return apiClient.post(`/requisitions/${id}/approve`);
  }
}

export class DepartmentAPI {
  static async getDepartments(params?: any) {
    return apiClient.get('/departments', { params });
  }

  static async getDepartment(id: number) {
    return apiClient.get(`/departments/${id}`);
  }

  static async createDepartment(data: any) {
    return apiClient.post('/departments', data);
  }

  static async updateDepartment(id: number, data: any) {
    return apiClient.put(`/departments/${id}`, data);
  }

  static async deleteDepartment(id: number) {
    return apiClient.delete(`/departments/${id}`);
  }
}

export class StockInAPI {
  static async getStockIns(params?: any) {
    return apiClient.get('/stock-in', { params });
  }

  static async getStockIn(id: number) {
    return apiClient.get(`/stock-in/${id}`);
  }

  static async createStockIn(data: any) {
    return apiClient.post('/stock-in', data);
  }

  static async updateStockIn(id: number, data: any) {
    return apiClient.put(`/stock-in/${id}`, data);
  }

  static async deleteStockIn(id: number) {
    return apiClient.delete(`/stock-in/${id}`);
  }
}

export class StockOutAPI {
  static async getStockOuts(params?: any) {
    return apiClient.get('/stock-out', { params });
  }

  static async getStockOut(id: number) {
    return apiClient.get(`/stock-out/${id}`);
  }

  static async createStockOut(data: any) {
    return apiClient.post('/stock-out', data);
  }

  static async updateStockOut(id: number, data: any) {
    return apiClient.put(`/stock-out/${id}`, data);
  }

  static async deleteStockOut(id: number) {
    return apiClient.delete(`/stock-out/${id}`);
  }
}

export class StockRequestAPI {
  static async getStockRequests(params?: any) {
    return apiClient.get('/stock-requests', { params });
  }

  static async getStockRequest(id: number) {
    return apiClient.get(`/stock-requests/${id}`);
  }

  static async createStockRequest(data: any) {
    return apiClient.post('/stock-requests', data);
  }

  static async updateStockRequest(id: number, data: any) {
    return apiClient.put(`/stock-requests/${id}`, data);
  }

  static async updateStockRequestStatus(id: number, data: any) {
    return apiClient.put(`/stock-requests/${id}/status`, data);
  }

  static async deleteStockRequest(id: number) {
    return apiClient.delete(`/stock-requests/${id}`);
  }
}

export class UserAPI {
  static async getUsers(params?: any) {
    return apiClient.get('/users', { params });
  }

  static async getUser(id: number) {
    return apiClient.get(`/users/${id}`);
  }

  static async createUser(data: any) {
    return apiClient.post('/users', data);
  }

  static async updateUser(id: number, data: any) {
    return apiClient.put(`/users/${id}`, data);
  }

  static async deleteUser(id: number) {
    return apiClient.delete(`/users/${id}`);
  }
}

export class ReportAPI {
  static async getReports(params?: any) {
    return apiClient.get('/reports', { params });
  }

  static async getStockMovement(params?: any) {
    return apiClient.get('/reports/stock-movement', { params });
  }

  static async getItemUsage(params?: any) {
    return apiClient.get('/reports/item-usage', { params });
  }
}

export class AuditLogAPI {
  static async getAuditLogs(params?: any) {
    return apiClient.get('/audit-logs', { params });
  }

  static async getAuditLog(id: number) {
    return apiClient.get(`/audit-logs/${id}`);
  }

  static async getStats(params?: any) {
    return apiClient.get('/audit-logs/stats', { params });
  }
}

export class MessageAPI {
  static async getConversations() {
    return apiClient.get('/messages/conversations');
  }

  static async getConversation(id: number) {
    return apiClient.get(`/messages/${id}`);
  }

  static async sendMessage(data: any) {
    return apiClient.post('/messages', data);
  }

  static async getEligibleRecipients() {
    return apiClient.get('/messages/eligible-recipients');
  }

  static async getUnreadCount() {
    return apiClient.get('/messages/unread-count');
  }

  static async markAsRead(conversationId: number) {
    return apiClient.post(`/messages/${conversationId}/mark-as-read`);
  }
}

export class NotificationAPI {
  static async getNotifications(params?: any) {
    return apiClient.get('/notifications', { params });
  }

  static async getUnreadCount() {
    return apiClient.get('/notifications/unread-count');
  }

  static async markAsRead(notificationId: number) {
    return apiClient.post(`/notifications/${notificationId}/mark-as-read`);
  }

  static async markAllAsRead() {
    return apiClient.post('/notifications/mark-all-as-read');
  }

  static async deleteNotification(notificationId: number) {
    return apiClient.delete(`/notifications/${notificationId}`);
  }

  static async deleteAllRead() {
    return apiClient.delete('/notifications/delete-all-read');
  }
}

export class SettingsAPI {
  static async getPreferences() {
    return apiClient.get('/settings/preferences');
  }

  static async updatePreferences(data: any) {
    return apiClient.put('/settings/preferences', data);
  }

  static async updatePassword(data: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }) {
    return apiClient.put('/settings/password', data);
  }

  static async updateTheme(theme: 'light' | 'dark') {
    return apiClient.put('/settings/theme', { theme });
  }

  static async updateNotifications(data: any) {
    return apiClient.put('/settings/notifications', data);
  }
}

export class PredictiveAnalysisAPI {
  static async getAll(params?: any) {
    return apiClient.get('/predictive-analysis', { params });
  }

  static async getPredictions(params?: any) {
    return apiClient.get('/predictive-analysis/predictions', { params });
  }

  static async getDemandForecast(params?: any) {
    return apiClient.get('/predictive-analysis/demand-forecast', { params });
  }

  static async getStockOptimization(params?: any) {
    return apiClient.get('/predictive-analysis/stock-optimization', { params });
  }

  static async getSeasonalTrends(params?: any) {
    return apiClient.get('/predictive-analysis/seasonal-trends', { params });
  }

  static async getInsights(params?: any) {
    return apiClient.get('/predictive-analysis/insights', { params });
  }
}

// Utility functions
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  } else if (error.message) {
    return error.message;
  } else {
    return 'An unexpected error occurred';
  }
};

export default apiClient;
