import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS設定を追加（開発環境用）
  app.enableCors({
    origin: 'http://localhost:3000', // フロントエンドのURL
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
