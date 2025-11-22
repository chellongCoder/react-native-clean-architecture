# Firebase Analytics Testing Guide

## Quick Start: Test Your Implementation

### 1. Enable Debug Mode

#### Android
```bash
# Enable debug mode
adb shell setprop debug.firebase.analytics.app com.vas.vietteltelecom.mydio

# Verify it's enabled
adb shell getprop debug.firebase.analytics.app
```

#### iOS (Xcode)
1. Open your iOS project in Xcode
2. Select your app scheme (top left near Play button)
3. Click: Product → Scheme → Edit Scheme
4. Go to: Run → Arguments
5. Add under "Arguments Passed On Launch": `-FIRDebugEnabled`
6. Click Close

### 2. Open Firebase Console DebugView
1. Go to: https://console.firebase.google.com/
2. Select your project
3. Click: Analytics → DebugView (in the left sidebar)
4. You should see "No devices connected" initially

### 3. Run Your App
```bash
# For Android
yarn android

# For iOS
yarn ios
```

### 4. Trigger Campaign Events

#### Test Install Attribution:
1. Uninstall your app completely
2. Reinstall the app
3. The `campaign_attribution` event should fire automatically if AppsFlyer data is present

#### Test Deep Link:
1. Create a test deep link with AppsFlyer
2. Open the link on your test device
3. The `campaign_deep_link` event should fire

#### Manual Test (for debugging):
Add this temporary code to test the analytics helper:

```typescript
// Add to RootNavigator.tsx useEffect for testing
useEffect(() => {
  // TEST ONLY - Remove after verification
  const testAnalytics = async () => {
    await logCampaignAttribution({
      mediaSource: 'test_source',
      campaignName: 'test_campaign',
      referralCode: 'test_referral',
      deviceToken: 'test_token',
      influencerId: 'test_influencer',
    });
  };
  
  // Wait 3 seconds then test
  setTimeout(testAnalytics, 3000);
}, []);
```

### 5. Verify in DebugView

You should see in real-time:
- **Event**: `campaign_attribution` or `campaign_deep_link`
- **Parameters**:
  - `media_source`: Your test value
  - `campaign_name`: Your test value
  - `referral_code`: Your test value
  - `device_token`: Your test value
  - `influencer_id`: Your test value
  - `is_first_launch` or `is_deep_link`: true
  - `timestamp`: Current timestamp

### 6. Disable Debug Mode (After Testing)

#### Android
```bash
adb shell setprop debug.firebase.analytics.app .none.
```

#### iOS
Remove the `-FIRDebugEnabled` argument from Xcode scheme

## View Production Data

### Timeline for Data Availability:
- **DebugView**: Real-time (during debug mode)
- **Events Dashboard**: 24-48 hours
- **BigQuery**: 24 hours (if enabled)

### Check Production Events:
1. Go to: Firebase Console → Analytics → Events
2. Look for your custom events:
   - `campaign_attribution`
   - `campaign_deep_link`
3. Click on event name to see details

### Create Custom Dashboard:
1. Go to: Analytics → Dashboard
2. Click "Add card" or customize existing
3. Add these widgets:
   - **Event count**: `campaign_attribution`
   - **Parameter breakdown**: `media_source`
   - **Parameter breakdown**: `campaign_name`

## Test Scenarios

### Scenario 1: Facebook Ad Install
```typescript
// Expected data when user installs from Facebook ad
{
  media_source: 'facebook',
  campaign_name: 'summer_promo_2024',
  referral_code: 'fb_summer',
  influencer_id: 'none',
  is_first_launch: true
}
```

### Scenario 2: Influencer Deep Link
```typescript
// Expected data when user clicks influencer link
{
  media_source: 'instagram',
  campaign_name: 'influencer_promo',
  referral_code: 'inf_john_doe',
  influencer_id: 'john_doe_123',
  is_deep_link: true
}
```

### Scenario 3: Organic Install
```typescript
// Expected data for organic install (no campaign)
{
  media_source: 'unknown',
  campaign_name: 'unknown',
  referral_code: 'unknown',
  influencer_id: 'none',
  is_first_launch: true
}
```

## Troubleshooting

### Problem: Events not showing in DebugView
**Solutions:**
1. Check debug mode is enabled: `adb shell getprop debug.firebase.analytics.app`
2. Verify Firebase is initialized before logging events
3. Check console logs for error messages
4. Ensure device is connected to internet
5. Try restarting the app

### Problem: Events in DebugView but not in Events Dashboard
**Solutions:**
1. Wait 24-48 hours for data to appear
2. Check date range in Events Dashboard
3. Verify you're looking at the correct Firebase project
4. Check if data sampling is enabled (for large datasets)

### Problem: Missing parameters in events
**Solutions:**
1. Check console logs for "❌ Firebase Analytics" errors
2. Verify parameter names (use underscores, lowercase)
3. Check that values aren't null/undefined
4. Ensure parameters are passed correctly to helper functions

### Problem: Duplicate events
**Solutions:**
1. Check if `listenAttribution` is called multiple times
2. Verify useEffect dependencies are correct
3. Add guards to prevent multiple calls
4. Check if deep link listener fires multiple times

## Best Practices

### 1. Always Test Before Production
- Use DebugView to verify events work correctly
- Test all user flows that trigger analytics
- Verify parameter values are correct

### 2. Monitor Analytics Regularly
- Check Events Dashboard weekly
- Look for anomalies or missing data
- Create alerts for important metrics

### 3. Document Your Events
- Keep a list of all custom events
- Document what each parameter means
- Share with your team

### 4. Clean Up Test Code
- Remove test/debug analytics calls before production
- Disable debug mode on production builds
- Remove console.logs in production

## Example Test Script

Create this file for automated testing: `test-analytics.ts`

```typescript
import { logCampaignAttribution, logCampaignDeepLink } from './src/core/presentation/utils/analyticsHelper';

export const runAnalyticsTests = async () => {
  console.log('🧪 Starting Analytics Tests...');
  
  // Test 1: Campaign Attribution
  console.log('Test 1: Campaign Attribution');
  await logCampaignAttribution({
    mediaSource: 'test_facebook',
    campaignName: 'test_summer_promo',
    referralCode: 'test_ref_123',
    deviceToken: 'test_device_abc',
    influencerId: 'test_influencer_1',
  });
  
  // Wait 2 seconds
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 2: Deep Link
  console.log('Test 2: Deep Link');
  await logCampaignDeepLink({
    mediaSource: 'test_instagram',
    campaignName: 'test_influencer_campaign',
    referralCode: 'test_deep_link',
    deviceToken: 'test_device_xyz',
    influencerId: 'test_influencer_2',
  });
  
  console.log('✅ Analytics Tests Complete - Check DebugView!');
};
```

## Quick Reference Commands

```bash
# Android Debug Mode
adb shell setprop debug.firebase.analytics.app com.vas.vietteltelecom.mydio
adb shell setprop debug.firebase.analytics.app .none.

# Check current debug setting
adb shell getprop debug.firebase.analytics.app

# View Android logs
adb logcat | grep -i firebase

# Run app
yarn android  # or yarn ios

# Build release
yarn android:release
```

## Next Steps

1. ✅ Test in DebugView (follow steps above)
2. ✅ Verify events appear with correct parameters
3. ✅ Wait 24-48 hours and check Events Dashboard
4. ✅ Create custom dashboard for monitoring
5. ✅ Set up BigQuery export (optional)
6. ✅ Train team on viewing analytics
7. ✅ Monitor and optimize campaigns based on data
