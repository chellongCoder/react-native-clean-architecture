import {useEffect, useState} from 'react';
import {Module} from 'src/home/application/types/GetListLessonResponse';
import {
  Question,
  Task,
} from 'src/home/application/types/GetListQuestionResponse';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';

export const useListQuestions = (lessonId: string) => {
  const homeStore = useHomeStore();

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    homeStore
      .getListQuestions({
        subjectId: lessonId,
      })
      .then(response => {
        setTasks(response.data.tasks);
      });
  }, [homeStore, homeStore.subjectId, lessonId]);

  return {
    tasks,
  };
};
