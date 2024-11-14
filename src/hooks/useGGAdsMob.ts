import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  TestIds,
  useRewardedInterstitialAd,
} from 'react-native-google-mobile-ads';
import Toast from 'react-native-toast-message';

const adUnitId = !__DEV__
  ? TestIds.REWARDED_INTERSTITIAL
  : 'ca-app-pub-9069193131931191/1910380480';

type Props = {};
export const useGGAdsMob = () => {
  const [loaded, setLoaded] = useState(false);
  console.log(
    '🛠 LOG: 🚀 --> ----------------------------------------------🛠 LOG: 🚀 -->',
  );
  console.log('🛠 LOG: 🚀 --> ~ useGGAdsMob ~ loaded:', loaded);
  console.log(
    '🛠 LOG: 🚀 --> ----------------------------------------------🛠 LOG: 🚀 -->',
  );

  const [adsId, setAdsId] = useState<string | null>(adUnitId);
  const {
    isLoaded,
    isClosed,
    load,
    show,
    isClicked,
    isEarnedReward,
    reward,
    error,
    isOpened,
  } = useRewardedInterstitialAd(adsId, {
    requestNonPersonalizedAdsOnly: true,
  });
  console.log(
    '🛠 LOG: 🚀 --> ------------------------------------------------------------------------🛠 LOG: 🚀 -->',
  );
  console.log(
    '🛠 LOG: 🚀 --> ~ useGGAdsMob ~ isLoaded, isClosed, isEarnedReward, error, isOpened:',
    isLoaded,
    isClosed,
    isEarnedReward,
    reward,
    error,
    isOpened,
  );
  console.log(
    '🛠 LOG: 🚀 --> ------------------------------------------------------------------------🛠 LOG: 🚀 -->',
  );

  useEffect(() => {
    if (isClosed) {
      setAdsId(null);
    }
  }, [isClosed]);

  useEffect(() => {
    setLoaded(true);
    load();
  }, [load]);

  const timeout = useRef<NodeJS.Timeout>();
  useEffect(() => {
    if (!timeout.current) {
      timeout.current = setTimeout(() => {
        setLoaded(false);
        Toast.show({type: 'error', text1: 'No ads loaded!'});
      }, 5000);
    }
    if (isLoaded) {
      if (!loaded) {
        Toast.show({type: 'success', text1: 'ads loaded!'});
      }
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      setLoaded(false);
    }
  }, [isLoaded, loaded]);

  const showAds = useCallback(() => {
    if (!isLoaded) {
      load();
    }
    show({immersiveModeEnabled: true});
  }, [isLoaded, load, show]);
  return {
    loaded: isLoaded,
    isFetching: loaded,
    showAds,
    isEarnedReward,
    reward,
    isClosed,
  };
};
