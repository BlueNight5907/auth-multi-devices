import { SharedModule } from './shared/shared.module';
import { QueryFailedFilter } from './filters/query-failed.filter';
import { UnprocessableEntityFilter } from './filters/bad-request.filter';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express/adapters';
import { middleware as expressCtx } from 'express-http-context';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { ApiConfigService } from './shared/services/api-config.service';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { setupSwagger } from './setup-swagger';
import InternalServerErrorExceptionFilter from './filters/internal-server-error.filter';
import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';

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

  const reflector = app.get(Reflector);

  app.useGlobalFilters(
    new InternalServerErrorExceptionFilter(),
    new HttpExceptionFilter(reflector),
    new UnprocessableEntityFilter(reflector),
    new QueryFailedFilter(reflector),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );

  const configService = app
    .select(SharedModule)
    .get<ApiConfigService>(ApiConfigService);

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
