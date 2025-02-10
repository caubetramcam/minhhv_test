import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoryModule } from './modules/category/category.module';
import configuration from './config/configuration';
import databaseConfig from './config/database-config';
import { ItemsModule } from './modules/item/item.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '@app/auth/auth.module';
import { UserModule } from '@app/user/user.module';
import { TypeModule } from '@app/type/type.module';
import { UserService } from '@app/user/user.service';
import { UploadModule } from '@app/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      cache: true,
    }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET_KEY'),
          signOptions: {
            expiresIn: config.get<string | number>(
              'JWT_EXPIRATION_TIME',
            ),
          },
        };
      },
      global: true,
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (): Promise<TypeOrmModuleOptions> => {
        return {
          ...databaseConfig,
          autoLoadEntities: true,
        };
      },
    }),
    {
      module: UserModule,
      global: true
    },
    ItemsModule,
    CategoryModule,
    AuthModule,
    TypeModule,
    UploadModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
