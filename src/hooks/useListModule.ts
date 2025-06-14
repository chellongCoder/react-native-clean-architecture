import {useEffect, useState} from 'react';
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
    if (authStore.selectedChild?._id && homeStore.subjectId) {
      globalLoading.toggleLoading(true, 'listModule');
      setIsLoading(true);
      homeStore
        .getListModules({
          subjectId: homeStore.subjectId,
          childrenId: authStore.selectedChild?._id,
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStore.selectedChild?._id, homeStore, homeStore.subjectId]);

  return {
    modules,
    selectedSubject: homeStore.listSubject.find(
      subject => subject._id === homeStore.subjectId,
    ),
    isLoading,
  };
};
