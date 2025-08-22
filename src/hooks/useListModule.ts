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

  const getListModules = useCallback(
    (childrenId: string, subjectId: string) => {
      globalLoading.toggleLoading(true, 'listModule');
      setIsLoading(true);
      homeStore
        .getListModules({
          subjectId: subjectId,
          childrenId: childrenId,
        })
        .then(response => {
          const listTitle = response.data.map(item => item.description);
          const listDesc = response.data.map(
            item => item.tasks?.map(task => task.description).toString() ?? '',
          );
          Promise.all([
            lessonStore.translateText({
              text: listTitle,
              targetLanguage: i18n.deviceLocale,
            }),
            lessonStore.translateText({
              text: listDesc,
              targetLanguage: i18n.deviceLocale,
            }),
          ])
            .then(([resTitle, resDesc]) => {
              const translatedModules = response.data.map((item, index) => ({
                ...item,
                name: resTitle.data[index],
                tasks: item.tasks?.map((task, i) => ({
                  ...task,
                  description: (resDesc.data[index] ?? '').split(',')[i], // split by comma and get the index of the task
                })),
              }));
              setModules(translatedModules);
            })
            .catch(() => {
              setModules(response.data);
            });
        })
        .finally(() => {
          globalLoading.toggleLoading(false, 'listModule');
          setIsLoading(false);
        });
    },
    [],
  );
  
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
    isLoading,
    getListModules,
  };
};
