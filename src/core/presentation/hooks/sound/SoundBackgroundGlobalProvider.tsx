import React, {PropsWithChildren, useContext, useEffect, useState} from 'react';
import {SoundBackgroundGlobalContext} from './SoundBackgroundGlobalContext';
import {SoundGlobalContext} from './SoundGlobalContext';
import {soundTrack} from './SoundGlobalProvider';
import {AppLifecycle} from 'react-native-applifecycle';
import {AppStateStatus} from 'react-native';
import {lessonModuleContainer} from 'src/lesson/LessonModule';
import {LessonStore} from 'src/lesson/presentation/stores/LessonStore/LessonStore';
import RootNavigation from '../../navigation/actions/RootNavigationActions';
import {STACK_NAVIGATOR} from '../../navigation/ConstantNavigator';

export const SoundBackgroundGlobalProvider = ({
  children,
}: PropsWithChildren) => {
  const {loopSound, isInitSoundDone, pauseSound, setVolume} =
    useContext(SoundGlobalContext);
  const lesson = lessonModuleContainer.getProvided(LessonStore);
  const route = RootNavigation.current?.getCurrentRoute();

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const listener = AppLifecycle.addEventListener(
      'change',
      (state: AppStateStatus) => {
        // do something

        if (state === 'background') {
          pauseSound();
        } else {
          if (route?.name !== STACK_NAVIGATOR.HOME.LESSON) {
            loopSound(soundTrack.ukulele_music);
          }
        }
      },
    );

    return () => listener.remove();
  }, [lesson.backgroundSound, loopSound, pauseSound, route?.name, setVolume]);

  useEffect(() => {
    setVolume(lesson.backgroundSound);
  }, [lesson.backgroundSound, setVolume]);

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
