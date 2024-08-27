import React, {PropsWithChildren, useContext, useEffect, useState} from 'react';
import {SoundBackgroundGlobalContext} from './SoundBackgroundGlobalContext';
import {SoundGlobalContext} from './SoundGlobalContext';
import {soundTrack} from './SoundGlobalProvider';
import {AppLifecycle} from 'react-native-applifecycle';
import {AppStateStatus} from 'react-native';

export const SoundBackgroundGlobalProvider = ({
  children,
}: PropsWithChildren) => {
  const {loopSound, isInitSoundDone, pauseSound, setVolume} =
    useContext(SoundGlobalContext);

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const listener = AppLifecycle.addEventListener(
      'change',
      (state: AppStateStatus) => {
        // do something

        if (state === 'background') {
          pauseSound();
        } else {
          loopSound(soundTrack.ukulele_music);
        }
      },
    );

    return () => listener.remove();
  }, [loopSound, pauseSound]);

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
    <SoundBackgroundGlobalContext.Provider value={{isPlaying, setVolume}}>
      {children}
    </SoundBackgroundGlobalContext.Provider>
  );
};
