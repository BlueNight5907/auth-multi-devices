import { LanguageInterceptor } from './interceptors/language-interceptor.service';
import { SharedModule } from './shared/shared.module';
import { QueryFailedFilter } from './filters/query-failed.filter';
import { UnprocessableEntityFilter } from './filters/i18n-validation-exception.filter';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express/adapters';
import { middleware as expressCtx } from 'express-http-context';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import Fingerprint from 'express-fingerprint';
import { ApiConfigService } from './shared/services/api-config.service';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { setupSwagger } from './setup-swagger';
import InternalServerErrorExceptionFilter from './filters/internal-server-error.filter';
import {
  ClassSerializerInterceptor,
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { TranslationInterceptor } from './interceptors/translation-interceptor.service';
import { TranslationService } from './shared/services/translation.service';
import { I18nMiddleware, i18nValidationErrorFactory } from 'nestjs-i18n';

async function bootstrap(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true },
  );
  app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  app.use(helmet());
  app.setGlobalPrefix('/api'); // use api as global prefix if you don't have subdomain
  app.use(compression());
  app.use(morgan('combined'));
  app.enableVersioning();

  // enable fingerprint
  app.use(Fingerprint());

  // use I18nMiddleware
  app.use(I18nMiddleware);

  const reflector = app.get(Reflector);

  const configService = app
    .select(SharedModule)
    .get<ApiConfigService>(ApiConfigService);

  const translationService = app
    .select(SharedModule)
    .get<TranslationService>(TranslationService);

  const listFilters = [
    new InternalServerErrorExceptionFilter(),
    new HttpExceptionFilter(reflector, translationService),
    new UnprocessableEntityFilter(reflector, translationService),
    new QueryFailedFilter(reflector, translationService),
  ];

  if (!configService.isDevelopment) {
    listFilters.shift();
  }

  app.useGlobalFilters(...listFilters);

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector),
    new LanguageInterceptor(),
    new TranslationInterceptor(translationService),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: false,
      exceptionFactory: i18nValidationErrorFactory,
    }),
  );

  if (configService.documentationEnabled) {
    setupSwagger(app);
  }

  app.use(expressCtx);

  const port = configService.appConfig.port;
  await app.listen(port);

  console.info(`server running on ${await app.getUrl()}`);

  return app;
}

bootstrap();
