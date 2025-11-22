import analytics from '@react-native-firebase/analytics';

/**
 * Firebase Analytics Helper
 * Centralized analytics tracking utilities
 */

export interface CampaignParams {
  mediaSource?: string;
  campaignName?: string;
  referralCode?: string;
  deviceToken?: string;
  influencerId?: string;
}

/**
 * Log campaign attribution event (first install)
 */
export const logCampaignAttribution = async (params: CampaignParams) => {
  try {
    await analytics().logEvent('campaign_attribution', {
      media_source: params.mediaSource ?? 'unknown',
      campaign_name: params.campaignName ?? 'unknown',
      referral_code: params.referralCode ?? 'unknown',
      device_token: params.deviceToken ?? 'unknown',
      influencer_id: params.influencerId ?? 'none',
      is_first_launch: true,
      timestamp: new Date().toISOString(),
    });
    console.log('✅ Firebase Analytics: Campaign attribution logged', params);
  } catch (error) {
    console.error('❌ Firebase Analytics: Failed to log campaign attribution', error);
  }
};

/**
 * Log deep link campaign event
 */
export const logCampaignDeepLink = async (params: CampaignParams) => {
  try {
    await analytics().logEvent('campaign_deep_link', {
      media_source: params.mediaSource ?? 'unknown',
      campaign_name: params.campaignName ?? 'unknown',
      referral_code: params.referralCode ?? 'unknown',
      device_token: params.deviceToken ?? 'unknown',
      influencer_id: params.influencerId ?? 'none',
      is_deep_link: true,
      timestamp: new Date().toISOString(),
    });
    console.log('✅ Firebase Analytics: Campaign deep link logged', params);
  } catch (error) {
    console.error('❌ Firebase Analytics: Failed to log campaign deep link', error);
  }
};

/**
 * Log user property for segmentation
 */
export const setUserProperty = async (key: string, value: string) => {
  try {
    await analytics().setUserProperty(key, value);
    console.log(`✅ Firebase Analytics: User property set - ${key}: ${value}`);
  } catch (error) {
    console.error('❌ Firebase Analytics: Failed to set user property', error);
  }
};

/**
 * Set user ID for tracking
 */
export const setUserId = async (userId: string) => {
  try {
    await analytics().setUserId(userId);
    console.log(`✅ Firebase Analytics: User ID set - ${userId}`);
  } catch (error) {
    console.error('❌ Firebase Analytics: Failed to set user ID', error);
  }
};

/**
 * Log custom event with parameters
 */
export const logCustomEvent = async (eventName: string, params?: Record<string, any>) => {
  try {
    await analytics().logEvent(eventName, params);
    console.log(`✅ Firebase Analytics: Custom event logged - ${eventName}`, params);
  } catch (error) {
    console.error(`❌ Firebase Analytics: Failed to log event - ${eventName}`, error);
  }
};

/**
 * Log purchase event (for monetization tracking)
 */
export const logPurchase = async (params: {
  value: number;
  currency: string;
  itemId?: string;
  itemName?: string;
}) => {
  try {
    await analytics().logEvent('purchase', {
      value: params.value,
      currency: params.currency,
      item_id: params.itemId,
      item_name: params.itemName,
    });
    console.log('✅ Firebase Analytics: Purchase logged', params);
  } catch (error) {
    console.error('❌ Firebase Analytics: Failed to log purchase', error);
  }
};

/**
 * Log sign up event
 */
export const logSignUp = async (method: string) => {
  try {
    await analytics().logSignUp({ method });
    console.log(`✅ Firebase Analytics: Sign up logged - ${method}`);
  } catch (error) {
    console.error('❌ Firebase Analytics: Failed to log sign up', error);
  }
};

/**
 * Log login event
 */
export const logLogin = async (method: string) => {
  try {
    await analytics().logLogin({ method });
    console.log(`✅ Firebase Analytics: Login logged - ${method}`);
  } catch (error) {
    console.error('❌ Firebase Analytics: Failed to log login', error);
  }
};

/**
 * Log tutorial begin
 */
export const logTutorialBegin = async () => {
  try {
    await analytics().logTutorialBegin();
    console.log('✅ Firebase Analytics: Tutorial begin logged');
  } catch (error) {
    console.error('❌ Firebase Analytics: Failed to log tutorial begin', error);
  }
};

/**
 * Log tutorial complete
 */
export const logTutorialComplete = async () => {
  try {
    await analytics().logTutorialComplete();
    console.log('✅ Firebase Analytics: Tutorial complete logged');
  } catch (error) {
    console.error('❌ Firebase Analytics: Failed to log tutorial complete', error);
  }
};

/**
 * Log level up (for gamification)
 */
export const logLevelUp = async (level: number, character?: string) => {
  try {
    await analytics().logLevelUp({
      level,
      character,
    });
    console.log(`✅ Firebase Analytics: Level up logged - Level ${level}`);
  } catch (error) {
    console.error('❌ Firebase Analytics: Failed to log level up', error);
  }
};

/**
 * Log lesson start
 */
export const logLessonStart = async (lessonId: string, lessonName: string) => {
  try {
    await analytics().logEvent('lesson_start', {
      lesson_id: lessonId,
      lesson_name: lessonName,
      timestamp: new Date().toISOString(),
    });
    console.log(`✅ Firebase Analytics: Lesson start logged - ${lessonName}`);
  } catch (error) {
    console.error('❌ Firebase Analytics: Failed to log lesson start', error);
  }
};

/**
 * Log lesson complete
 */
export const logLessonComplete = async (
  lessonId: string,
  lessonName: string,
  score?: number,
  duration?: number,
) => {
  try {
    await analytics().logEvent('lesson_complete', {
      lesson_id: lessonId,
      lesson_name: lessonName,
      score,
      duration_seconds: duration,
      timestamp: new Date().toISOString(),
    });
    console.log(`✅ Firebase Analytics: Lesson complete logged - ${lessonName}`);
  } catch (error) {
    console.error('❌ Firebase Analytics: Failed to log lesson complete', error);
  }
};

/**
 * Log achievement unlocked
 */
export const logAchievementUnlocked = async (achievementId: string, achievementName: string) => {
  try {
    await analytics().logEvent('achievement_unlocked', {
      achievement_id: achievementId,
      achievement_name: achievementName,
      timestamp: new Date().toISOString(),
    });
    console.log(`✅ Firebase Analytics: Achievement unlocked - ${achievementName}`);
  } catch (error) {
    console.error('❌ Firebase Analytics: Failed to log achievement unlocked', error);
  }
};
