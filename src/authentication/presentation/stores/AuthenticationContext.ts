import {createContext} from 'react';
import {AuthenticationContextType} from './types/AuthenticationContextType';

export const AuthenticationContext =
  createContext<AuthenticationContextType | null>(null);

AuthenticationContext.displayName = 'AuthenticationContext';
