/**
 * Get Current Router Name
 * @param previousRouteName
 * @param currentRouteName
 */
import analytics from '@react-native-firebase/analytics';

export const screenTracking = async (
  previousRouteName: string | undefined,
  currentRouteName: string,
): Promise<void> => {
  console.log('screenTracking: ', currentRouteName);
  if (previousRouteName !== currentRouteName) {
    // track something
    await analytics().logScreenView({
      screen_name: currentRouteName,
      screen_class: currentRouteName,
    });
  }
};
