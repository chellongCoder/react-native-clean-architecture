import {useEffect, useState} from 'react';
import useAuthenStore from 'src/authentication/presentation/hooks/useAuthenStore';
import {useLoadingGlobal} from 'src/core/presentation/hooks/loading/useLoadingGlobal';
import {Module} from 'src/home/application/types/GetListLessonResponse';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';

export const useListModule = () => {
  const homeStore = useHomeStore();
  const globalLoading = useLoadingGlobal();

  const [modules, setModules] = useState<Module[]>([]);
  const authStore = useAuthenStore();

  useEffect(() => {
    if (authStore.selectedChild?._id && homeStore.subjectId) {
      globalLoading.toggleLoading(true, 'listModule');
      homeStore
        .getListModules({
          subjectId: homeStore.subjectId,
          childrenId: authStore.selectedChild?._id,
        })
        .then(response => {
          setModules(response.data);
        })
        .finally(() => {
          globalLoading.toggleLoading(false, 'listModule');
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStore.selectedChild?._id, homeStore, homeStore.subjectId]);

  return {
    modules,
    selectedSubject: homeStore.listSubject.find(
      subject => subject._id === homeStore.subjectId,
    ),
  };
};
