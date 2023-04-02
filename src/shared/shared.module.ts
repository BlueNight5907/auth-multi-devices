import { ValidatorService } from './services/validator.service';
import { TranslationService } from './services/translation.service';
import { Global, Module, Provider } from '@nestjs/common';
import { ApiConfigService } from './services/api-config.service';
import { CqrsModule } from '@nestjs/cqrs';
import { CaslAbilityFactory } from './services/casl-ability.factory';

const providers: Provider[] = [
  ApiConfigService,
  TranslationService,
  ValidatorService,
  CaslAbilityFactory,
];

@Global()
@Module({
  providers,
  imports: [CqrsModule],
  exports: [...providers, CqrsModule],
})
export class SharedModule {}
