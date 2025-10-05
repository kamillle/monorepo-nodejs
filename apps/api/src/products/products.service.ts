import { Injectable } from '@nestjs/common';
import type { Product } from '@repo/contract';
import { PrismaService } from '../prisma/prisma.service';
import type { Product as PrismaProduct } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // Prisma の Product を API レスポンス用の Product に変換
  private mapToProduct(prismaProduct: PrismaProduct): Product {
    return {
      id: prismaProduct.id,
      name: prismaProduct.name,
      price: prismaProduct.price,
      description: prismaProduct.description,
      inStock: prismaProduct.inStock,
      createdAt: prismaProduct.createdAt.toISOString(),
      updatedAt: prismaProduct.updatedAt.toISOString(),
    };
  }

  async getAllProducts(): Promise<Product[]> {
    const products = await this.prisma.product.findMany();
    return products.map((p) => this.mapToProduct(p));
  }

  async getProductById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    return product ? this.mapToProduct(product) : null;
  }

  async createProduct(data: {
    name: string;
    price: number;
    description: string;
    inStock?: boolean;
  }): Promise<Product> {
    const product = await this.prisma.product.create({
      data,
    });
    return this.mapToProduct(product);
  }

  async updateProduct(
    id: string,
    data: {
      name?: string;
      price?: number;
      description?: string;
      inStock?: boolean;
    },
  ): Promise<Product> {
    const product = await this.prisma.product.update({
      where: { id },
      data,
    });
    return this.mapToProduct(product);
  }

  async deleteProduct(id: string): Promise<Product> {
    const product = await this.prisma.product.delete({
      where: { id },
    });
    return this.mapToProduct(product);
  }
}

