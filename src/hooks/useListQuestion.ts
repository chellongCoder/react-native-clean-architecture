import {useEffect, useState} from 'react';
import {useLoadingGlobal} from 'src/core/presentation/hooks/loading/useLoadingGlobal';
import {Module} from 'src/home/application/types/GetListLessonResponse';
import {
  Question,
  Task,
} from 'src/home/application/types/GetListQuestionResponse';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';

export const useListQuestions = (lessonId: string) => {
  const homeStore = useHomeStore();

  const [tasks, setTasks] = useState<Task[]>([]);

  const loading = useLoadingGlobal();

  useEffect(() => {
    loading.show?.();
    homeStore
      .getListQuestions({
        subjectId: lessonId,
      })
      .then(response => {
        setTasks(response.data.tasks);
      })
      .finally(() => {
        loading.hide?.();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeStore, homeStore.subjectId, lessonId]);

  return {
    tasks,
  };
};
