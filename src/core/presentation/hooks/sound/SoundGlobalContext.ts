import {createContext} from 'react';
import {SoundGlobalT} from '../../@types/SoundGlobalT';

export const SoundGlobalContext = createContext<SoundGlobalT>({
  isPlaying: false,
  playSound: () => null,
  pauseSound: () => null,
  loopSound: () => null,
  isInitSoundDone: false,
  setVolume: () => null,
});

SoundGlobalContext.displayName = 'AuthenticationContext';
