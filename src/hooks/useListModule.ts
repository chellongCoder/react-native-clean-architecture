import {useCallback, useEffect, useState} from 'react';
import useAuthenStore from 'src/authentication/presentation/hooks/useAuthenStore';
import {useLoadingGlobal} from 'src/core/presentation/hooks/loading/useLoadingGlobal';
import {useI18n} from 'src/core/presentation/hooks/useI18n';
import {Module} from 'src/home/application/types/GetListLessonResponse';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';
import {useLessonStore} from 'src/lesson/presentation/stores/LessonStore/useGetPostsStore';

export const useListModule = () => {
  const homeStore = useHomeStore();
  const lessonStore = useLessonStore();
  const globalLoading = useLoadingGlobal();
  const i18n = useI18n();

  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const authStore = useAuthenStore();
 
  
  useEffect(() => {
    setModules(lessonStore.modulesBySubject);
  }, [lessonStore.modulesBySubject])

  useEffect(() => {
    if (lessonStore.isLoadingModulesBySubject) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [lessonStore.isLoadingModulesBySubject])
  
  return {
    modules,
    selectedSubject: homeStore.listSubject.find(
      subject => subject._id === homeStore.subjectId,
    ),
    isLoading: lessonStore.isLoadingModulesBySubject,
  };
};
