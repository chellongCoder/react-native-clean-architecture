import {createContext} from 'react';
import {SoundGlobalT} from '../../@types/SoundGlobalT';

export const SoundGlobalContext = createContext<SoundGlobalT | null>(null);

SoundGlobalContext.displayName = 'AuthenticationContext';
