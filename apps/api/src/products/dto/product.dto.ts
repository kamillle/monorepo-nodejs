import { createZodDto } from 'nestjs-zod';
import { ProductSchema, GetProductsResponseSchema } from '@repo/contract';

// Zod スキーマから NestJS の DTO クラスを生成
export class ProductDto extends createZodDto(ProductSchema) {}

export class GetProductsResponseDto extends createZodDto(
  GetProductsResponseSchema,
) {}




