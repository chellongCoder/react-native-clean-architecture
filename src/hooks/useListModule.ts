import {useEffect, useState} from 'react';
import useAuthenStore from 'src/authentication/presentation/hooks/useAuthenStore';
import {Module} from 'src/home/application/types/GetListLessonResponse';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';

export const useListModule = () => {
  const homeStore = useHomeStore();

  const [modules, setModules] = useState<Module[]>([]);
  const authStore = useAuthenStore();

  useEffect(() => {
    homeStore
      .getListModules({
        subjectId: homeStore.subjectId,
        childrenId: authStore.selectedChild?._id ?? '',
      })
      .then(response => {
        setModules(response.data);
      });
  }, [authStore.selectedChild?._id, homeStore, homeStore.subjectId]);

  return {
    modules,
    selectedSubject: homeStore.listSubject.find(
      subject => subject._id === homeStore.subjectId,
    ),
  };
};
