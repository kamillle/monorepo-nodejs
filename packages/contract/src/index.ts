import { z } from 'zod';

// 共有ユーティリティや型定義をここに配置

export function greet(name: string): string {
  return `Hello, ${name}!`;
}

// Zod スキーマ定義
export const UserSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  email: z.email(),
});

// Product スキーマ
export const ProductSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  price: z.number().positive(),
  description: z.string(),
  inStock: z.boolean(),
  createdAt: z.iso.datetime().optional(),
  updatedAt: z.iso.datetime().optional(),
});

// GetProductsResponse スキーマ
export const GetProductsResponseSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number().int().nonnegative(),
});

// TypeScript型をZodスキーマから生成
export type User = z.infer<typeof UserSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type GetProductsResponse = z.infer<typeof GetProductsResponseSchema>;

// Zodスキーマをエクスポート
export { z };

