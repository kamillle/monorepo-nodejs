import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 既存のデータをクリア
  await prisma.product.deleteMany();

  // サンプルデータを作成
  const products = [
    {
      name: 'ワイヤレスマウス',
      price: 2980,
      description: '高精度センサー搭載の快適なワイヤレスマウス',
      inStock: true,
    },
    {
      name: 'メカニカルキーボード',
      price: 12800,
      description: '静音性に優れたメカニカルキーボード',
      inStock: true,
    },
    {
      name: 'USB-Cハブ',
      price: 4500,
      description: '7ポート搭載の多機能USBハブ',
      inStock: false,
    },
    {
      name: 'ノートPCスタンド',
      price: 3200,
      description: '高さ調節可能なアルミ製スタンド',
      inStock: true,
    },
  ];

  for (const product of products) {
    const created = await prisma.product.create({
      data: product,
    });
    console.log(`Created product with id: ${created.id}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

