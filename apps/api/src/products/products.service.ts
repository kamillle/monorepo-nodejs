import { Injectable } from '@nestjs/common';
import type { Product } from '@repo/contract';

@Injectable()
export class ProductsService {
  private readonly products: Product[] = [
    {
      id: '1',
      name: 'ワイヤレスマウス',
      price: 2980,
      description: '高精度センサー搭載の快適なワイヤレスマウス',
      inStock: true,
    },
    {
      id: '2',
      name: 'メカニカルキーボード',
      price: 12800,
      description: '静音性に優れたメカニカルキーボード',
      inStock: true,
    },
    {
      id: '3',
      name: 'USB-Cハブ',
      price: 4500,
      description: '7ポート搭載の多機能USBハブ',
      inStock: false,
    },
    {
      id: '4',
      name: 'ノートPCスタンド',
      price: 3200,
      description: '高さ調節可能なアルミ製スタンド',
      inStock: true,
    },
  ];

  getAllProducts(): Product[] {
    return this.products;
  }

  getProductById(id: string): Product | undefined {
    return this.products.find((product) => product.id === id);
  }
}

