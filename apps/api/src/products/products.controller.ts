import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import type { GetProductsResponse, Product } from '@repo/shared';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getProducts(): GetProductsResponse {
    const products = this.productsService.getAllProducts();
    return {
      products,
      total: products.length,
    };
  }

  @Get(':id')
  getProductById(@Param('id') id: string): Product {
    const product = this.productsService.getProductById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }
}

