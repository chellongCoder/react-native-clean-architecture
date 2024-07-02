import {createContext} from 'react';
import {HomeContextType} from './types/HomeContextType';

export const HomeContext = createContext<HomeContextType>(null);

HomeContext.displayName = 'HomeContext';
