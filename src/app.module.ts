import { UsersModule } from './modules/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import path from 'path';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';
import { RouterModule, Routes } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';

const listRoutes: Routes = [
  {
    path: 'v1',
    children: [
      {
        path: 'users',
        module: UsersModule,
      },
    ],
  },
];

const modules = [UsersModule, AuthModule];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [ApiConfigService],
      useFactory: async (apiConfigService: ApiConfigService) =>
        apiConfigService.mySQLConfig,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ApiConfigService) => ({
        fallbackLanguage: configService.fallbackLanguage,
        loaderOptions: {
          path: path.join(__dirname, '/i18n/'),
          watch: configService.isDevelopment,
        },
        fallbacks: {
          'en-*': 'en',
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
      imports: [SharedModule],
      inject: [ApiConfigService],
    }),
    ...modules,
    RouterModule.register(listRoutes),
  ],
})
export class AppModule {}
