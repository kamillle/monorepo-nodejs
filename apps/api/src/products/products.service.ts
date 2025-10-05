import { Injectable } from '@nestjs/common';
import type { Product } from '@repo/contract';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getAllProducts(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async createProduct(data: {
    name: string;
    price: number;
    description: string;
    inStock?: boolean;
  }): Promise<Product> {
    return this.prisma.product.create({
      data,
    });
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
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id: string): Promise<Product> {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}

