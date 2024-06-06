import {useContextStore} from 'src/core/presentation/hooks/useContextStore';
import {LessonStoreContext} from './LessonStoreContext';
import {LessonStore} from './LessonStore';

export const useLessonStore = (): LessonStore => {
  const store = useContextStore(LessonStoreContext);

  return store;
};
