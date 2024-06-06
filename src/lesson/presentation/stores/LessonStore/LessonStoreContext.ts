import {createContext} from 'react';
import {LessonStore} from './LessonStore';

export const LessonStoreContext = createContext<LessonStore | null>(null);

LessonStoreContext.displayName = 'LessonStoreContext';
