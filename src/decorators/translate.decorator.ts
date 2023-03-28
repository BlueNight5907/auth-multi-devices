import { ITranslationDecoratorInterface } from '../common/interfaces';
import { translationKeys } from '../constants';

// FIXME: This is a temporary solution to get the translation decorator working.
export function StaticTranslate(
  data: ITranslationDecoratorInterface = {},
): PropertyDecorator {
  return (target, key) => {
    Reflect.defineMetadata(
      translationKeys.STATIC_TRANSLATION_DECORATOR_KEY,
      data,
      target,
      key,
    );
  };
}

export function DynamicTranslate(): PropertyDecorator {
  return (target, key) => {
    Reflect.defineMetadata(
      translationKeys.DYNAMIC_TRANSLATION_DECORATOR_KEY,
      {},
      target,
      key,
    );
  };
}
