import React, {useCallback, useEffect, useState} from 'react';
import {
  RewardedInterstitialAd,
  RewardedAdEventType,
  TestIds,
  useInterstitialAd,
  RewardedAd,
  AdEventType,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-4704292500396201/2885520039';

export const useGGAdsMob = () => {
  const [loaded, setLoaded] = useState(false);
  const rewarded = RewardedAd.createForAdRequest(adUnitId, {
    keywords: ['parent', 'children', 'study'],
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
      },
    );
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward of ', reward);
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
  }, [rewarded]);

  const showAds = useCallback(() => {
    rewarded.show();
  }, [rewarded]);
  return {
    loaded,
    showAds,
  };
};
