export interface SoundGlobalT {
  isPlaying: boolean;
  playSound: (key: string) => void;
  pauseSound: () => void;
  loopSound: (key: string) => void;
  isInitSoundDone: boolean;
  setVolume: (volume: number) => void;
}
