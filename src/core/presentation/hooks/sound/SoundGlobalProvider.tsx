import React, {PropsWithChildren, useState} from 'react';
import {SoundGlobalContext} from './SoundGlobalContext';
import Sound from 'react-native-sound';

Sound.setCategory('Playback');

export const SoundGlobalProvider = ({children}: PropsWithChildren) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const oh_no_sound = new Sound('oh_no_sound.mp3', Sound.MAIN_BUNDLE, error => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
    // oh_no_sound.play(() => oh_no_sound.release());
  });

  const menu_selection_sound = new Sound(
    'menu_selection_sound.mp3',
    Sound.MAIN_BUNDLE,
    error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      // menu_selection_sound.play(() => menu_selection_sound.release());
    },
  );

  const login_splash_screen_sound = new Sound(
    'login_splash_screen_sound.mp3',
    Sound.MAIN_BUNDLE,
    error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      // login_splash_screen_sound.play(() => login_splash_screen_sound.release());
    },
  );

  const good_result = new Sound('good_result.mp3', Sound.MAIN_BUNDLE, error => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
    // good_result.play(() => good_result.release());
  });

  const big_bell_sound = new Sound(
    'big_bell_sound.mp3',
    Sound.MAIN_BUNDLE,
    error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      // big_bell_sound.play(() => big_bell_sound.release());
    },
  );

  const bell_ding_sound = new Sound(
    'bell_ding_sound.mp3',
    Sound.MAIN_BUNDLE,
    error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      // bell_ding_sound.play(() => bell_ding_sound.release());
    },
  );

  return (
    <SoundGlobalContext.Provider
      value={{
        isPlaying,
      }}>
      {children}
    </SoundGlobalContext.Provider>
  );
};
