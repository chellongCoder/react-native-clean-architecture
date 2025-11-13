import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import React, {FC, useEffect, useState} from 'react';
import AppNavigator from './AppNavigator';
import {STACK_NAVIGATOR} from './ConstantNavigator';
import {useFonts} from '../hooks/useFonts';
import useLoginWithCredentials from 'src/authentication/presentation/hooks/useLoginWithCredentials';
import {useOfflineMode} from '../hooks/offline/useOfflineMode';
import {OfflineEnum} from '../hooks/offline/OfflineEnum';
import {withProviders} from '../utils/withProviders';
import {LessonStoreProvider} from 'src/lesson/presentation/stores/LessonStore/LessonStoreProvider';
import {usePermissionApplock} from 'src/hooks/usePermissionApplock';
import useHydration from 'src/hooks/useHydration';
import {PopupModalGlobalProvider} from '../hooks/popup/PopupModalGlobalProvider';
import {useI18n} from '../hooks/useI18n';
import appsFlyer from 'react-native-appsflyer';
import { useCampaign } from 'src/authentication/presentation/hooks/useCampaign';
import { isAndroid } from '../utils';
// REMOVED: getAndroidId, getDeviceToken - violates Families Policy
import {v4 as uuidv4} from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CampaignE } from './types';

export const AppStack = createStackNavigator();

const RootNavigator: FC = () => {
  const {getUsernamePasswordInKeychain} = useLoginWithCredentials();
  const {isConnected, getData} = useOfflineMode();
  const i18n = useI18n();

  const isHydrated = useHydration();
  const {postCampaign} = useCampaign();

  useFonts();
  usePermissionApplock();

  const [userProfile, setUserProfile] = useState();

  // Listen to conversion data
  const listenAttribution = async () => {
    appsFlyer.onInstallConversionData(async (data) => {
      if (data.type === "onInstallConversionDataLoaded") {
        const attrData = data.data;
        const mediaSource = attrData.media_source;   // e.g. facebook / instagram / tiktok_int
        const campaign = attrData.campaign as CampaignE;          // campaign name
        const referralCode = attrData.path; // if you passed it in link
        const influencerId = attrData.influencer_id; // get influencer id if any
        console.log("Install from:", mediaSource, "Campaign:", campaign, "Referral:", referralCode);
        
        // FAMILIES POLICY COMPLIANT: Use app-scoped UUID instead of device identifiers
        let deviceToken;
        try {
          // Try to get existing UUID from storage
          const storedToken = await AsyncStorage.getItem('@app_device_token');
          if (storedToken) {
            deviceToken = storedToken;
          } else {
            // Generate new UUID (not a device identifier, just app-scoped)
            deviceToken = uuidv4();
            await AsyncStorage.setItem('@app_device_token', deviceToken);
          }
        } catch (error) {
          console.log('Error getting device token:', error);
          deviceToken = uuidv4(); // Fallback to temporary UUID
        }
        
        postCampaign({
          mediaSource: mediaSource ?? 'string',
          campaignName: campaign ?? 'string',
          referCode: referralCode ?? 'string',
          deviceToken: deviceToken ?? 'string',
          influencerId: influencerId ?? '',
          token: 'alphadex',
        });
      }
    });

    appsFlyer.onInstallConversionFailure((error) => {
      console.error("Attribution error:", error);
    });
  };

  useEffect(() => {
    listenAttribution();
  }, []);

  useEffect(() => {
    const deepLinkListener = appsFlyer.onDeepLink(res => {
      console.log('Deep link data:', res);
      if (res.status === 'success' && res.deepLinkStatus === 'FOUND' && res.data?.influencer_id) {
        const influencerId = res.data.influencer_id;
        // Handle free diamonds or tracking here
      }
    });

    return () => {
      deepLinkListener(); // unsubscribe
    };
  }, []);

  useEffect(() => {
    const getDataFromStore = async () => {
      if (!isConnected) {
        const res = await getData(OfflineEnum.USER_PROFILE);
        setUserProfile(res);
      }
    };

    getDataFromStore();
  }, [getData, isConnected]);

  useEffect(() => {
    if (isConnected !== null && isHydrated) {
      if (isConnected) {
        getUsernamePasswordInKeychain();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, isHydrated, userProfile]);

  useEffect(() => {
    i18n.changeLanguage(i18n.deviceLocale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.deviceLocale]);

  return (
    <AppStack.Navigator
      screenOptions={{
        cardOverlayEnabled: true,
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid, // Add this line
      }}
      initialRouteName={STACK_NAVIGATOR.AUTH_NAVIGATOR}>
      {AppNavigator()}
    </AppStack.Navigator>
  );
};

export default withProviders(
  LessonStoreProvider,
  PopupModalGlobalProvider,
)(RootNavigator);
