# Firebase Analytics Flow Diagram

## 📱 Campaign Attribution Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    User Installs App                            │
│                  (from Marketing Campaign)                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   AppsFlyer SDK                                 │
│             Detects Install Attribution                         │
│   - Media Source (facebook/instagram/tiktok)                    │
│   - Campaign Name                                               │
│   - Referral Code                                               │
│   - Influencer ID                                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│             RootNavigator.tsx (Your Code)                       │
│         listenAttribution() Function                            │
│                                                                 │
│   1. Receives AppsFlyer data                                    │
│   2. Gets device token                                          │
│   3. Calls logCampaignAttribution()                             │
│   4. Sends data to backend (postCampaign)                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│         analyticsHelper.ts                                      │
│      logCampaignAttribution()                                   │
│                                                                 │
│   Formats data and logs to Firebase:                            │
│   Event: "campaign_attribution"                                 │
│   Parameters:                                                   │
│     - media_source                                              │
│     - campaign_name                                             │
│     - referral_code                                             │
│     - device_token                                              │
│     - influencer_id                                             │
│     - is_first_launch: true                                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│        Firebase Analytics SDK                                   │
│    @react-native-firebase/analytics                             │
│                                                                 │
│   Sends event data to Firebase servers                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              Firebase Backend                                   │
│                                                                 │
│   Stores and processes analytics data                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          ▼                             ▼
┌─────────────────────┐      ┌──────────────────────┐
│   DebugView         │      │   Events Dashboard   │
│   (Real-time)       │      │   (24-48 hours)      │
│                     │      │                      │
│   - Live events     │      │   - Historical data  │
│   - All parameters  │      │   - Aggregated stats │
│   - Testing only    │      │   - Charts & graphs  │
└─────────────────────┘      └──────────────────────┘
```

## 🔗 Deep Link Flow

```
┌─────────────────────────────────────────────────────────────────┐
│          User Clicks Deep Link                                  │
│    (Influencer link, email, social media)                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│               AppsFlyer Deep Link Handler                       │
│           Extracts Campaign Data from URL                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│             RootNavigator.tsx                                   │
│         onDeepLink Listener                                     │
│                                                                 │
│   1. Receives deep link data                                    │
│   2. Gets device token                                          │
│   3. Calls logCampaignDeepLink()                                │
│   4. Awards diamonds/tracks influencer                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│         analyticsHelper.ts                                      │
│      logCampaignDeepLink()                                      │
│                                                                 │
│   Event: "campaign_deep_link"                                   │
│   Parameters:                                                   │
│     - media_source                                              │
│     - campaign_name                                             │
│     - referral_code                                             │
│     - influencer_id                                             │
│     - is_deep_link: true                                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
                   Firebase Analytics
```

## 📊 Data Flow Timeline

```
Time 0 (Install/Deep Link)
    │
    ├─► App receives attribution data
    │
Time +1 second
    │
    ├─► logCampaignAttribution() called
    │
Time +2 seconds
    │
    ├─► Firebase Analytics logs event
    │   (visible in console logs)
    │
Time +5 seconds (DebugView enabled)
    │
    ├─► Event appears in Firebase DebugView
    │   ✅ You can see it NOW!
    │
Time +24-48 hours
    │
    └─► Event appears in Events Dashboard
        ✅ Production analytics data
```

## 🎯 How to View Your Data

```
Firebase Console
    │
    ├─► Analytics
    │   │
    │   ├─► DebugView (Real-time testing)
    │   │   │
    │   │   ├─► See events as they happen
    │   │   ├─► All parameters visible
    │   │   └─► Perfect for debugging
    │   │
    │   ├─► Events (Production data)
    │   │   │
    │   │   ├─► campaign_attribution
    │   │   │   ├─► Event count over time
    │   │   │   ├─► Parameter breakdowns
    │   │   │   └─► User engagement
    │   │   │
    │   │   └─► campaign_deep_link
    │   │       ├─► Event count over time
    │   │       └─► Parameter breakdowns
    │   │
    │   ├─► Dashboard (Custom views)
    │   │   │
    │   │   ├─► Campaign performance cards
    │   │   ├─► Media source comparison
    │   │   └─► Time series charts
    │   │
    │   └─► BigQuery (Advanced)
            │
            └─► SQL queries for deep analysis
```

## 🔍 Data Structure in Firebase

### Event: campaign_attribution
```
{
  "event_name": "campaign_attribution",
  "event_timestamp": 1699966800000000,
  "user_pseudo_id": "abc123...",
  "event_params": [
    {
      "key": "media_source",
      "value": { "string_value": "facebook" }
    },
    {
      "key": "campaign_name",
      "value": { "string_value": "summer_promo_2024" }
    },
    {
      "key": "referral_code",
      "value": { "string_value": "FB_SUMMER" }
    },
    {
      "key": "device_token",
      "value": { "string_value": "device_abc123" }
    },
    {
      "key": "influencer_id",
      "value": { "string_value": "john_doe_123" }
    },
    {
      "key": "is_first_launch",
      "value": { "int_value": 1 }
    }
  ]
}
```

## 🚀 Quick Start Checklist

```
Testing Phase (Today):
    ☐ Enable debug mode (adb command)
    ☐ Open Firebase Console → DebugView
    ☐ Run your app
    ☐ Trigger install/deep link
    ☐ Verify event appears with correct data
    ☐ Check all parameters are present
    ☐ Disable debug mode

Production Phase (After 24 hours):
    ☐ Open Firebase Console → Events
    ☐ Find campaign_attribution event
    ☐ Verify data is accumulating
    ☐ Create custom dashboard
    ☐ Set up regular monitoring
    ☐ Share access with team

Analysis Phase (Ongoing):
    ☐ Compare campaign performance
    ☐ Identify best media sources
    ☐ Track influencer effectiveness
    ☐ Optimize marketing spend
    ☐ Create reports for stakeholders
```

## 💡 Example: Complete User Journey

```
1. User sees Facebook ad (Campaign: summer_promo_2024)
   ↓
2. Clicks ad → App Store
   ↓
3. Installs app
   ↓
4. Opens app for first time
   ↓
5. AppsFlyer detects attribution
   ↓
6. Your code logs to Firebase:
   Event: campaign_attribution
   media_source: "facebook"
   campaign_name: "summer_promo_2024"
   ↓
7. [IMMEDIATE] Appears in DebugView (if enabled)
   ↓
8. [24 HOURS] Appears in Events Dashboard
   ↓
9. Marketing team analyzes:
   - Facebook campaign brought X users
   - Summer promo is performing well
   - Should increase Facebook ad spend
```

## 📈 What You Can Track

```
Attribution Events:
    ├─► campaign_attribution (first install)
    └─► campaign_deep_link (influencer links)

User Actions (available helpers):
    ├─► sign_up
    ├─► login
    ├─► tutorial_begin
    ├─► tutorial_complete
    ├─► lesson_start
    ├─► lesson_complete
    ├─► level_up
    ├─► achievement_unlocked
    └─► purchase

Custom Events:
    └─► Any custom event you want to track
        (use logCustomEvent helper)
```
