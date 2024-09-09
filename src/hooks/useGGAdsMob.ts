import React, {useEffect, useState} from 'react';
import {
  RewardedInterstitialAd,
  RewardedAdEventType,
  TestIds,
  useInterstitialAd,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.REWARDED_INTERSTITIAL
  : 'ca-app-pub-4704292500396201/2885520039';
const rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(
  adUnitId,
  {
    keywords: ['fashion', 'clothing'],
  },
);

export const useGGAdsMob = () => {
  const [loaded, setLoaded] = useState(false);
  const {isLoaded, isClosed, load, show} = useInterstitialAd(
    'ca-app-pub-4704292500396201/2885520039',
    {
      requestNonPersonalizedAdsOnly: true,
    },
  );
  React.useEffect(() => {
    if (isClosed) {
      load();
    }
  }, [isClosed, load]);

  useEffect(() => {
    const unsubscribeLoaded = rewardedInterstitial.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded(true);
      },
    );
    const unsubscribeEarned = rewardedInterstitial.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward of ', reward);
      },
    );

    // Start loading the rewarded interstitial ad straight away
    rewardedInterstitial.load();

    // Unsubscribe from events on unmount
    // return () => {
    //   unsubscribeLoaded();
    //   unsubscribeEarned();
    // };
  }, []);

  const showAds = () => {
    const rewarded = RewardedInterstitialAd.createForAdRequest(adUnitId, {
      keywords: ['fashion', 'clothing'],
    });

    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        rewarded.show();
      },
    );

    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('Callback called!');
      },
    );

    rewarded.load();
  };

  return {
    loaded,
    showAds,
  };
};
