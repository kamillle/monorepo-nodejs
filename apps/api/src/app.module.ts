import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
