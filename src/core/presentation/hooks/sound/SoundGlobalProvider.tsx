import React, {PropsWithChildren, useCallback, useState} from 'react';
import {SoundGlobalContext} from './SoundGlobalContext';
import Sound from 'react-native-sound';

Sound.setCategory('Playback');

export const SoundGlobalProvider = ({children}: PropsWithChildren) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const playSound = (path: string) => {
    const sound = new Sound(path, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
      // Play the sound with an onEnd callback
      sound.play(success => {
        if (success) {
          console.log('Successfully finished playing');
        } else {
          console.log('Playback failed due to audio decoding errors');
        }
      });
    });
  };

  return (
    <SoundGlobalContext.Provider
      value={{
        isPlaying,
      }}>
      {children}
    </SoundGlobalContext.Provider>
  );
};
