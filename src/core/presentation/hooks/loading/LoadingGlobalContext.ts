import {createContext} from 'react';
import {LoadingGlobalT} from '../../@types/LoadingGlobalT';

export const LoadingGlobalContext = createContext<LoadingGlobalT | null>(null);

LoadingGlobalContext.displayName = 'AuthenticationContext';
