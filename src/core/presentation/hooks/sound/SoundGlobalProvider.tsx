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

interface ExtendedSound extends Sound {
  _isPlaying?: boolean;
}

export const SoundGlobalProvider = ({children}: PropsWithChildren) => {
  const [sounds, setSounds] = useState<{[key: string]: ExtendedSound[]}>({});
  const [loopingSoundKey, setLoopingSoundKey] = useState<string | null>(null);
  const [currentPlayingSound, setCurrentPlayingSound] =
    useState<ExtendedSound | null>(null);
  const [isInitSoundDone, setIsInitSoundDone] = useState<boolean>(false);

  const playSound = useCallback((key: string) => {
    const soundFile = soundResource[key as keyof typeof soundResource];
    if (soundFile) {
      // Create a new sound instance each time
      const sound = new Sound(soundFile, Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.log(`Failed to load sound ${key}`, error);
          return;
        }
        sound.setNumberOfLoops(0);
        sound.play(success => {
          if (!success) {
            console.log(`Failed to play sound ${key}`);
          }
          // After playback, the sound instance is released, so no need to manually reset `_isPlaying`
          console.log(`Sound ${key} finished playing`);
        });
        // Track the playing status
        setCurrentPlayingSound(sound);
      });
    }
  }, []);

  const pauseSound = useCallback(() => {
    if (currentPlayingSound) {
      console.log('Pausing current playing sound');
      currentPlayingSound.pause();
      console.log('currentPlayingSound: ', currentPlayingSound);
      setCurrentPlayingSound(null); // Clear reference to the sound
    } else {
      console.log('No sound is currently playing');
    }
  }, [currentPlayingSound]);

  const loopSound = useCallback((key: string) => {
    const soundFile = soundResource[key as keyof typeof soundResource];
    if (soundFile) {
      // Create a new sound instance each time
      const sound = new Sound(soundFile, Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.log(`Failed to load sound ${key}`, error);
          return;
        }
        sound.setNumberOfLoops(-1);
        sound.play(success => {
          if (!success) {
            console.log(`Failed to play sound ${key}`);
          }
          // Log status when finished looping, if needed
          console.log(`Sound ${key} started looping`);
        });
        // Track the playing status
        setCurrentPlayingSound(sound);
        setLoopingSoundKey(key);
      });
    }
  }, []);

  const setVolume = useCallback(
    (volume: number) => {
      Object.values(sounds)
        .flat()
        .forEach(sound => {
          if (sound) {
            currentPlayingSound?.setVolume(volume);
            sound.setVolume(0);
          }
        });
    },
    [currentPlayingSound, sounds],
  );

  useEffect(() => {
    return () => {
      // Ensure to release any sound that might still be playing
      if (currentPlayingSound) {
        currentPlayingSound.release();
      }
    };
  }, [currentPlayingSound]);

  useEffect(() => {
    const initializeSounds = () => {
      const loadedSounds: {[key: string]: ExtendedSound[]} = {};

      Object.entries(soundResource).forEach(([key, resource]) => {
        loadedSounds[key] = [];
        for (let i = 0; i < 2; i++) {
          const sound = new Sound(resource, Sound.MAIN_BUNDLE, error => {
            if (error) {
              console.log(`Failed to load sound ${key}`, error);
            }
          }) as ExtendedSound;
          loadedSounds[key].push(sound);
        }
      });

      setSounds(loadedSounds);

      return () => {
        Object.values(loadedSounds).forEach(pool => {
          pool.forEach(sound => sound.release());
        });
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
