import React, {PropsWithChildren, useContext, useEffect, useState} from 'react';
import {SoundBackgroundGlobalContext} from './SoundBackgroundGlobalContext';
import {SoundGlobalContext} from './SoundGlobalContext';
import {soundTrack} from './SoundGlobalProvider';

export const SoundBackgroundGlobalProvider = ({
  children,
}: PropsWithChildren) => {
  const {loopSound, isInitSoundDone} = useContext(SoundGlobalContext);

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isInitSoundDone) {
      const timeoutId = setTimeout(() => {
        setIsPlaying(true);
        loopSound(soundTrack.ukulele_music);
      }, 1000); // Delay of 500ms

      return () => clearTimeout(timeoutId);
    }
  }, [loopSound, isInitSoundDone]);

  return (
    <SoundBackgroundGlobalContext.Provider value={{isPlaying}}>
      {children}
    </SoundBackgroundGlobalContext.Provider>
  );
};
