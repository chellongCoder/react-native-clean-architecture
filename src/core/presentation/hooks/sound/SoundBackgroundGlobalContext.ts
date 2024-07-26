import {createContext} from 'react';
import {SoundBackgroundGlobalT} from '../../@types/SoundBackgroundGlobalT';

export const SoundBackgroundGlobalContext =
  createContext<SoundBackgroundGlobalT | null>(null);

SoundBackgroundGlobalContext.displayName = 'SoundBackgroundGlobalContext';
