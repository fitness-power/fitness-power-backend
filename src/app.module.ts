import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { configDotenv } from 'dotenv';
import { ProductModule } from './modules/product/product.module';
import { ResInterceptor } from './interceptors/res.interceptor';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { EmailModule } from './email/email.module';
import { CategoryModule } from './modules/categories/categories.module';
import { TypesModule } from './modules/types/types.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';

configDotenv({ path: './src/config/config.env' });

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './config/config.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_KEY'),
      }),
      inject: [ConfigService],
    }),
    EmailModule.forRoot({
      host: 'EMAIL_HOST',
      port: 'EMAIL_PORT',
      secure: true,
      auth: {
        user: 'EMAIL_USER',
        pass: 'EMAIL_PASS',
      },
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE },
    }),
    AuthModule,
    CategoryModule,
    TypesModule,
    ProductModule,
    CartModule,
    EmailModule,
    OrderModule,
  ],
  providers: [
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ResInterceptor,
    },
    CloudinaryService,
  ],
})
export class AppModule {}
