import {getModuleContainer, module} from 'inversify-sugar';
import I18n from './presentation/i18n';
import HttpClient from './infrastructure/implementations/HttpClient';
import {IHttpClientToken} from './domain/specifications/IHttpClient';
import {EnvToken} from './domain/entities/Env';
import env from './infrastructure/env';
import {IapStore} from './presentation/store/iapStore';

@module({
  providers: [
    I18n,
    {
      isGlobal: true,
      provide: EnvToken,
      useValue: env,
    },
    {
      isGlobal: true,
      provide: IHttpClientToken,
      useClass: HttpClient,
    },
    {
      isGlobal: true,
      useClass: IapStore,
      scope: 'Singleton',
    },
  ],
})
export class CoreModule {}

export const coreModuleContainer = getModuleContainer(CoreModule);
