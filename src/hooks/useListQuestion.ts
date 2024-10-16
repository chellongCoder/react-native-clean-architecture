import {useEffect, useState} from 'react';
import {useLoadingGlobal} from 'src/core/presentation/hooks/loading/useLoadingGlobal';

import {
  LessonSettingT,
  Task,
} from 'src/home/application/types/GetListQuestionResponse';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';

export const useListQuestions = (lessonId: string) => {
  const homeStore = useHomeStore();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [lessonSetting, setLessonSetting] = useState<LessonSettingT>();

  const loading = useLoadingGlobal();

  useEffect(() => {
    loading.show?.();
    homeStore
      .getListQuestions({
        subjectId: lessonId,
      })
      .then(response => {
        setTasks(() => {
          setLessonSetting(response.data.lessonSetting);
          return response.data.tasks;
        });
      })
      .finally(() => {
        loading.hide?.();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeStore, homeStore.subjectId, lessonId]);

  return {
    tasks,
    lessonSetting,
  };
};
