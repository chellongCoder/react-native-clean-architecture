import {getModuleContainer, module} from 'inversify-sugar';

@module({
  providers: [],
})
export class AchievementModule {}

export const achievementModuleContainer = getModuleContainer(AchievementModule);
