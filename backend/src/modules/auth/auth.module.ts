import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '@app/user/user.module';
import { UserService } from '@app/user/user.service';

@Module({
  imports: [],
  controllers: [AuthController],
})
export class AuthModule {}
