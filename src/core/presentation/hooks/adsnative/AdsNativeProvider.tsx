import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {AdsNativeContext} from './AdsNativeContext';
import {AdManager, TestIds} from 'react-native-admob-native-ads';

export const AdsNativeProvider = ({children}: PropsWithChildren) => {
  useEffect(() => {
    AdManager.setRequestConfiguration({
      tagForChildDirectedTreatment: false,
    });

    // image test ad
    AdManager.registerRepository({
      name: 'imageAd',
      adUnitId: TestIds.Image,
      numOfAds: 3,
      expirationPeriod: 3600000,
    }).then(result => {
      console.log('registered: ', result);
    });

    // unmute video test ad
    AdManager.registerRepository({
      name: 'videoAd',
      adUnitId: TestIds.Video,
      numOfAds: 3,
      requestNonPersonalizedAdsOnly: false,
      videoOptions: {
        muted: false,
      },
      expirationPeriod: 3600000, // in milliseconds (optional)
      mediationEnabled: false,
    }).then(result => {
      console.log('registered: ', result);
    });

    // mute video test ad
    AdManager.registerRepository({
      name: 'muteVideoAd',
      adUnitId: TestIds.Video,
      numOfAds: 3,
      requestNonPersonalizedAdsOnly: false,
      videoOptions: {
        muted: true,
      },
      expirationPeriod: 3600000, // in milliseconds (optional)
      mediationEnabled: false,
    }).then(result => {
      console.log('registered: ', result);
    });

    AdManager.subscribe('imageAd', 'onAdPreloadClicked', event => {
      console.log('click', 'imageAd', event);
    });

    AdManager.subscribe('imageAd', 'onAdPreloadImpression', event => {
      console.log('impression recorded', 'imageAd', event);
    });
  }, []);

  return (
    <AdsNativeContext.Provider value={{}}>{children}</AdsNativeContext.Provider>
  );
};
