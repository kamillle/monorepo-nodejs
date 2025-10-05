// 共有ユーティリティや型定義をここに配置

export function greet(name: string): string {
  return `Hello, ${name}!`;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

// API Response Types
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  inStock: boolean;
}

export interface GetProductsResponse {
  products: Product[];
  total: number;
}

