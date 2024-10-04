import {createContext} from 'react';
import {OfflineModeT} from '../../@types/OfflineModeT';
import {useGGAdsMob} from 'src/hooks/useGGAdsMob';
import {RewardedAdReward} from 'react-native-google-mobile-ads';

type GoogleAdsmobT = {
  loaded: boolean;
  showAds: () => void;
  isEarnedReward: boolean;
  reward: RewardedAdReward;
  isClosed: boolean;
  isFetching: boolean;
};
export const GoogleAdsmobContext = createContext<Partial<GoogleAdsmobT>>({});

GoogleAdsmobContext.displayName = 'GoogleAdsmobContext';
