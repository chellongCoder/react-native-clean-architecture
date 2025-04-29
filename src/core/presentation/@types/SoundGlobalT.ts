export interface SoundGlobalT {
  playSound: (key: string) => void;
  pauseSound: (callback?: () => void) => void;
  loopSound: (key: string) => void;
  isInitSoundDone: boolean;
  setVolume: (volume: number) => void;
  setVolumeBackground: (volume: number) => void;
}
