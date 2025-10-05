import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({ example: '1', description: '商品ID' })
  id: string;

  @ApiProperty({ example: 'ノートパソコン', description: '商品名' })
  name: string;

  @ApiProperty({ example: 89800, description: '価格' })
  price: number;

  @ApiProperty({
    example: '高性能なノートパソコン',
    description: '商品説明',
  })
  description: string;

  @ApiProperty({ example: true, description: '在庫あり' })
  inStock: boolean;
}

export class GetProductsResponseDto {
  @ApiProperty({ type: [ProductDto], description: '商品リスト' })
  products: ProductDto[];

  @ApiProperty({ example: 3, description: '商品の総数' })
  total: number;
}




