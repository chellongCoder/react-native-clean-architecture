# Firebase Analytics Implementation Guide

## Overview
This guide explains how to use Firebase Analytics to track campaign attribution and view the data in Firebase Console.

## Implementation

### 1. Firebase Analytics Events Logged

The app now logs two main campaign events:

#### a) `campaign_attribution` - First Install Attribution
Triggered when a user installs the app from a marketing campaign.

**Parameters:**
- `media_source` - Source of install (e.g., 'facebook', 'instagram', 'tiktok_int')
- `campaign_name` - Name of the campaign
- `referral_code` - Referral/path code if present
- `device_token` - Device identifier
- `influencer_id` - Influencer ID if applicable
- `is_first_launch` - Boolean indicating first launch

#### b) `campaign_deep_link` - Deep Link Campaign
Triggered when a user opens the app via a deep link with campaign data.

**Parameters:**
- `media_source` - Source of deep link
- `campaign_name` - Name of the campaign
- `referral_code` - Referral/path code if present
- `device_token` - Device identifier
- `influencer_id` - Influencer ID if applicable
- `is_deep_link` - Boolean indicating deep link

### 2. Code Implementation

```typescript
// Log campaign attribution (first install)
await analytics().logEvent('campaign_attribution', {
  media_source: mediaSource ?? 'unknown',
  campaign_name: campaign ?? 'unknown',
  referral_code: referralCode ?? 'unknown',
  device_token: deviceToken ?? 'unknown',
  influencer_id: influencerId ?? 'none',
  is_first_launch: true,
});

// Log deep link campaign
await analytics().logEvent('campaign_deep_link', {
  media_source: mediaSource ?? 'unknown',
  campaign_name: campaign ?? 'unknown',
  referral_code: referralCode ?? 'unknown',
  device_token: deviceToken ?? 'unknown',
  influencer_id: influencerId ?? 'none',
  is_deep_link: true,
});
```

## Viewing Analytics in Firebase Console

### Step 1: Access Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (TBD-Edu or your project name)

### Step 2: Navigate to Analytics Dashboard
1. In the left sidebar, click on **Analytics**
2. Select **Events** from the submenu

### Step 3: View Custom Events
1. In the Events dashboard, you'll see all logged events
2. Look for your custom events:
   - `campaign_attribution`
   - `campaign_deep_link`
3. Click on any event to see detailed breakdowns

### Step 4: Create Custom Reports

#### A. View Campaign Attribution Report
1. Go to **Analytics** → **Events**
2. Click on `campaign_attribution` event
3. You'll see:
   - Event count over time
   - Parameter values breakdown
   - User engagement metrics

#### B. Create Dashboard
1. Go to **Analytics** → **Dashboard**
2. Click **Create Dashboard** or **Customize**
3. Add widgets:
   - Event count: `campaign_attribution`
   - Parameter breakdown: `media_source`
   - Parameter breakdown: `campaign_name`

### Step 5: Use DebugView for Real-time Testing

#### For Android:
```bash
# Enable debug mode
adb shell setprop debug.firebase.analytics.app com.vas.vietteltelecom.mydio

# Disable debug mode
adb shell setprop debug.firebase.analytics.app .none.
```

#### For iOS:
1. In Xcode, select your app scheme
2. Edit Scheme → Run → Arguments
3. Add argument: `-FIRDebugEnabled`

#### View DebugView:
1. Go to **Analytics** → **DebugView**
2. Trigger your campaign attribution (install app or deep link)
3. See events appear in real-time with all parameters

### Step 6: Create Custom Dimensions (Optional)

1. Go to **Analytics** → **Events** → Click on your event
2. Click on a parameter (e.g., `media_source`)
3. Click **Mark as custom dimension**
4. Use in reports and BigQuery

### Step 7: Export to BigQuery (Advanced)

1. Go to **Project Settings** → **Integrations**
2. Enable **BigQuery** integration
3. Query your analytics data with SQL:

```sql
SELECT
  event_name,
  user_pseudo_id,
  event_timestamp,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'media_source') AS media_source,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'campaign_name') AS campaign_name,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'influencer_id') AS influencer_id
FROM
  `your-project.analytics_xxxxx.events_*`
WHERE
  event_name IN ('campaign_attribution', 'campaign_deep_link')
  AND _TABLE_SUFFIX BETWEEN '20240101' AND '20241231'
ORDER BY
  event_timestamp DESC
LIMIT 1000;
```

## Best Practices

### 1. Parameter Naming
- Use lowercase with underscores (e.g., `media_source`)
- Keep names under 40 characters
- Use consistent naming across events

### 2. Event Naming
- Use descriptive names (e.g., `campaign_attribution` not `camp_attr`)
- Maximum 500 distinct events per app
- Use event parameters to differentiate rather than creating multiple events

### 3. Testing
- Always test with DebugView before production
- Verify all parameters are being sent correctly
- Check data appears in Events dashboard within 24 hours

### 4. Privacy Considerations
- Don't send PII (Personally Identifiable Information)
- Use app-scoped identifiers (you're already using device tokens correctly)
- Comply with GDPR/COPPA if applicable

## Monitoring Campaign Performance

### Key Metrics to Track:
1. **Event Count**: Total campaign attributions
2. **Media Source Breakdown**: Which channels perform best
3. **Campaign Performance**: Compare different campaigns
4. **Influencer Impact**: Track influencer-driven installs
5. **Conversion Rates**: From install to active user

### Create Funnel Analysis:
1. Go to **Analytics** → **Events**
2. Click **Analysis** → **Funnel analysis**
3. Add steps:
   - Step 1: `campaign_attribution`
   - Step 2: User registration/login
   - Step 3: First lesson completion

## Troubleshooting

### Events Not Appearing?
1. Wait 24 hours - Analytics data is not real-time (except DebugView)
2. Check DebugView for immediate verification
3. Ensure Firebase SDK is initialized before logging events
4. Verify Google Services configuration files are present

### Parameters Missing?
1. Check parameter names match Firebase naming conventions
2. Verify parameter values aren't null/undefined
3. Maximum 25 parameters per event
4. Parameter values must be strings or numbers

### Data Discrepancies?
1. Compare with AppsFlyer data
2. Check for timezone differences
3. Verify attribution windows
4. Look for sampling in large datasets

## Additional Resources

- [Firebase Analytics Documentation](https://firebase.google.com/docs/analytics)
- [Event Reference](https://firebase.google.com/docs/reference/android/com/google/firebase/analytics/FirebaseAnalytics.Event)
- [Parameter Reference](https://firebase.google.com/docs/reference/android/com/google/firebase/analytics/FirebaseAnalytics.Param)
- [DebugView Guide](https://firebase.google.com/docs/analytics/debugview)

## Example Queries for Common Questions

### "Which campaign brought the most users?"
Go to Events → `campaign_attribution` → Filter by `campaign_name`

### "What's our most effective media source?"
Go to Events → `campaign_attribution` → Filter by `media_source`

### "How many influencer-driven installs?"
Go to Events → `campaign_attribution` → Filter by `influencer_id` (not empty)

### "Attribution over time?"
Go to Dashboard → Add time series widget for `campaign_attribution`
