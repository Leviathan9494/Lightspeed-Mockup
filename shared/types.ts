// Shared types for Lightspeed Mockapp

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface PinRequest {
  sessionId: string;
  pin: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
  requiresPin?: boolean;
  sessionId?: string;
}

export interface PinResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
}

export interface InventoryResponse {
  success: boolean;
  data?: Product[];
  message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}