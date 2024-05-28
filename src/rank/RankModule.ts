import {getModuleContainer, module} from 'inversify-sugar';

@module({
  providers: [],
})
export class RankModule {}

export const rankModuleContainer = getModuleContainer(RankModule);
