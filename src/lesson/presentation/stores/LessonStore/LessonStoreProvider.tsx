import {PropsWithChildren} from 'react';
import {LessonStoreContext} from './LessonStoreContext';
import {LessonStore} from './LessonStore';
import React from 'react';
import {lessonModuleContainer} from 'src/lesson/LessonModule';
import Scoring from 'src/core/presentation/components/Scoring';
import {observer} from 'mobx-react';

export const LessonStoreProvider = observer(({children}: PropsWithChildren) => {
  const value = lessonModuleContainer.getProvided(LessonStore);
  return (
    <LessonStoreContext.Provider value={value}>
      {children}
      {value.point.isShow && <Scoring onClose={() => value.setIsShow(false)} />}
    </LessonStoreContext.Provider>
  );
});
