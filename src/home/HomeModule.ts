import {getModuleContainer, module} from 'inversify-sugar';

@module({
  providers: [],
})
export class HomeModule {}

export const homeModuleContainer = getModuleContainer(HomeModule);
