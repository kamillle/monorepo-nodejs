import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import type { GetProductsResponse, Product } from '@repo/contract';
import { ProductDto, GetProductsResponseDto } from './dto/product.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: '商品一覧を取得' })
  @ApiResponse({
    status: 200,
    description: '商品一覧を返す',
    type: GetProductsResponseDto,
  })
  async getProducts(): Promise<GetProductsResponse> {
    const products = await this.productsService.getAllProducts();
    return {
      products,
      total: products.length,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '商品を ID で取得' })
  @ApiParam({ name: 'id', description: '商品ID', example: '1' })
  @ApiResponse({
    status: 200,
    description: '商品情報を返す',
    type: ProductDto,
  })
  @ApiResponse({
    status: 404,
    description: '商品が見つかりません',
  })
  async getProductById(@Param('id') id: string): Promise<Product> {
    const product = await this.productsService.getProductById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }
}

