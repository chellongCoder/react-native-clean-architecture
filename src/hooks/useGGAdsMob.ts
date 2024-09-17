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

  const showAds = () => {
    const rewarded = RewardedInterstitialAd.createForAdRequest(adUnitId, {
      keywords: ['fashion', 'clothing'],
    });

    rewarded.load();
  };

  return {
    loaded,
    showAds,
  };
};
