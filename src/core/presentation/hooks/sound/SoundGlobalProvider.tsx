import React, {
  PropsWithChildren,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {SoundGlobalContext} from './SoundGlobalContext';
import Sound from 'react-native-sound';

Sound.setCategory('Playback');

const soundResource = {
  oh_no_sound: 'oh_no_sound.mp3',
  menu_selection_sound: 'menu_selection_sound.mp3',
  login_splash_screen_sound: 'login_splash_screen_sound.mp3',
  good_result: 'good_result.mp3',
  big_bell_sound: 'big_bell_sound.mp3',
  bell_ding_sound: 'bell_ding_sound.mp3',
  ukulele_music: 'ukulele_music.mp3',
};

export const soundTrack = {
  oh_no_sound: 'oh_no_sound',
  menu_selection_sound: 'menu_selection_sound',
  login_splash_screen_sound: 'login_splash_screen_sound',
  good_result: 'good_result',
  big_bell_sound: 'big_bell_sound',
  bell_ding_sound: 'bell_ding_sound',
  ukulele_music: 'ukulele_music',
};

export const SoundGlobalProvider = ({children}: PropsWithChildren) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [sounds, setSounds] = useState<{[key: string]: Sound | null}>({});
  const [currentSoundKey, setCurrentSoundKey] = useState<string | null>(null);
  const [isInitSoundDone, setIsInitSoundDone] = useState<boolean>(false);

  const playSound = useCallback(
    (key: string) => {
      const sound = sounds[key];
      if (sound) {
        sound.setNumberOfLoops(0);
        sound.play(success => {
          if (!success) {
            console.log(`failed to play the sound ${key}`);
          }
          setIsPlaying(false);
          setCurrentSoundKey(null);
        });
        setIsPlaying(true);
        setCurrentSoundKey(key);
      }
    },
    [sounds],
  );

  const pauseSound = useCallback(() => {
    if (currentSoundKey) {
      const sound = sounds[currentSoundKey];
      if (sound && isPlaying) {
        sound.pause();
        setIsPlaying(false);
      }
    }
  }, [currentSoundKey, isPlaying, sounds]);

  const loopSound = useCallback(
    (key: string) => {
      const sound = sounds[key];
      if (sound) {
        sound.setNumberOfLoops(-1);
        sound.play(success => {
          if (!success) {
            console.log(`failed to play the sound ${key}`);
          }
          setIsPlaying(false);
          setCurrentSoundKey(null);
        });
        setIsPlaying(true);
        setCurrentSoundKey(key);
      }
    },
    [sounds],
  );

  const setVolume = useCallback(
    (volume: number) => {
      Object.values(sounds).forEach(sound => {
        if (sound) {
          sound.setVolume(volume); // Set the volume for all sounds
        }
      });
    },
    [sounds],
  );

  useEffect(() => {
    const initializeSounds = () => {
      const loadedSounds: {[key: string]: Sound} = {};

      Object.entries(soundResource).forEach(([key, resource]) => {
        loadedSounds[key] = new Sound(resource, Sound.MAIN_BUNDLE, error => {
          if (error) {
            console.log(`failed to load the sound ${resource}`, error);
          }
        });
      });

      setSounds(loadedSounds);

      return () => {
        Object.values(loadedSounds).forEach(sound => sound.release());
      };
    };

    const cleanUp = initializeSounds();

    return cleanUp;
  }, []);

  useEffect(() => {
    const init = () => {
      if (Object.keys(sounds).length === Object.keys(soundResource).length) {
        setIsInitSoundDone(true);
      }
    };

    const cleanUp = init();

    return cleanUp;
  }, [sounds]);

  return (
    <SoundGlobalContext.Provider
      value={{
        isPlaying,
        playSound,
        pauseSound,
        loopSound,
        isInitSoundDone,
        setVolume,
      }}>
      {children}
    </SoundGlobalContext.Provider>
  );
};
