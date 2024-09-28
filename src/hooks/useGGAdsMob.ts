import React, {useCallback, useEffect, useState} from 'react';
import {
  RewardedInterstitialAd,
  RewardedAdEventType,
  TestIds,
  useInterstitialAd,
  RewardedAd,
  AdEventType,
  RewardedAdReward,
  useRewardedInterstitialAd,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.REWARDED_INTERSTITIAL
  : TestIds.REWARDED_INTERSTITIAL;

type Props = {
  onEarnReward: (reward?: RewardedAdReward) => void;
};
export const useGGAdsMob = ({onEarnReward}: Props) => {
  const [loaded, setLoaded] = useState(false);
  console.log(
    '🛠 LOG: 🚀 --> ----------------------------------------------🛠 LOG: 🚀 -->',
  );
  console.log('🛠 LOG: 🚀 --> ~ useGGAdsMob ~ loaded:', loaded);
  console.log(
    '🛠 LOG: 🚀 --> ----------------------------------------------🛠 LOG: 🚀 -->',
  );
  const {isLoaded, isClosed, load, show, isClicked, isEarnedReward, reward} =
    useRewardedInterstitialAd(TestIds.REWARDED_INTERSTITIAL, {
      requestNonPersonalizedAdsOnly: true,
      keywords: ['parent', 'children', 'study'],
      requestAgent: 'CoolAds',
    });
  console.log(
    '🛠 LOG: 🚀 --> ------------------------------------------------------------------------🛠 LOG: 🚀 -->',
  );
  console.log(
    '🛠 LOG: 🚀 --> ~ useGGAdsMob ~ isLoaded, isClosed, isEarnedReward:',
    isLoaded,
    isClosed,
    isEarnedReward,
    reward,
  );
  console.log(
    '🛠 LOG: 🚀 --> ------------------------------------------------------------------------🛠 LOG: 🚀 -->',
  );

  const rewarded = RewardedInterstitialAd.createForAdRequest(adUnitId, {
    keywords: ['parent', 'children', 'study'],
    requestNonPersonalizedAdsOnly: true,
    requestAgent: 'CoolAds',
  });

  useEffect(() => {
    if (isClosed) {
      rewarded.load();
      setLoaded(false);
      onEarnReward();
    }
  }, [isClosed, onEarnReward, rewarded]);

  useEffect(() => {
    console.log('User earned reward of ', reward);
    if (reward && isClosed) {
      onEarnReward(reward);
    }
  }, [isClosed, onEarnReward, reward]);

  useEffect(() => {
    load();
  }, [load]);

  const showAds = useCallback(() => {
    show({immersiveModeEnabled: true});
  }, [show]);
  return {
    loaded: isLoaded,
    showAds,
  };
};
