import React, {useCallback, useEffect, useState} from 'react';
import {
  RewardedInterstitialAd,
  RewardedAdEventType,
  TestIds,
  useInterstitialAd,
  RewardedAd,
  AdEventType,
  RewardedAdReward,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.REWARDED_INTERSTITIAL
  : 'ca-app-pub-4704292500396201/2885520039';

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
  const rewarded = RewardedInterstitialAd.createForAdRequest(adUnitId, {
    keywords: ['parent', 'children', 'study'],
    requestNonPersonalizedAdsOnly: true,
    requestAgent: 'CoolAds',
  });

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded(true);
      },
    );

    const unsubscribeClosed = rewarded.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        console.log(
          '🛠 LOG: 🚀 --> ------------------------------------------------🛠 LOG: 🚀 -->',
        );
        console.log('🛠 LOG: 🚀 --> ~ useEffect ~ rewarded:', rewarded);
        console.log(
          '🛠 LOG: 🚀 --> ------------------------------------------------🛠 LOG: 🚀 -->',
        );

        rewarded.load();
        setLoaded(false);
        onEarnReward();
      },
    );
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward of ', reward);
        onEarnReward(reward);
      },
    );

    // Start loading the rewarded ad straight away
    rewarded.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rewarded]);

  const showAds = useCallback(() => {
    rewarded.show();
  }, [rewarded]);
  return {
    loaded,
    showAds,
  };
};
