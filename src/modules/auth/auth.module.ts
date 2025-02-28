import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, user_schema } from './auth.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { EmailModule } from 'src/email/email.module';
import { AuthGuard } from 'src/guards/auth.guard';
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: user_schema }]),
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    CloudinaryService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
  exports: [MongooseModule],
})
export class AuthModule {}
