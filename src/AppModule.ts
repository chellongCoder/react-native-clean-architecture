import {module} from 'inversify-sugar';
import {PostModule} from './post/PostModule';
import {CoreModule} from './core/CoreModule';
import {LessonModule} from './lesson/LessonModule';
import {HomeModule} from './home/HomeModule';
import {AchievementModule} from './achievement/AchievementModule';
import {RankModule} from './rank/RankModule';

@module({
  imports: [
    CoreModule,
    PostModule,
    HomeModule,
    LessonModule,
    AchievementModule,
    RankModule,
  ],
})
export default class AppModule {}
