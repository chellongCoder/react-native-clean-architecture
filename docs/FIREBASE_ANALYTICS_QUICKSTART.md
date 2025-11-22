# Firebase Analytics Quick Start Summary

## ✅ What Was Implemented

### 1. Analytics Helper Functions
Created: `src/core/presentation/utils/analyticsHelper.ts`

This file provides:
- `logCampaignAttribution()` - Track first install attribution
- `logCampaignDeepLink()` - Track deep link campaigns
- `logSignUp()`, `logLogin()` - Track authentication
- `logLessonStart()`, `logLessonComplete()` - Track learning progress
- And many more helper functions

### 2. Updated RootNavigator
Modified: `src/core/presentation/navigation/RootNavigator.tsx`

Now tracks:
- Campaign attribution on first install
- Deep link campaigns with influencer data

### 3. Documentation
Created:
- `FIREBASE_ANALYTICS_GUIDE.md` - Complete guide for Firebase Console
- `FIREBASE_ANALYTICS_TESTING.md` - Step-by-step testing guide

## 🚀 Quick Test (5 minutes)

### Step 1: Enable Debug Mode
```bash
# Android
adb shell setprop debug.firebase.analytics.app com.vas.vietteltelecom.mydio
```

### Step 2: Open DebugView
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Analytics → DebugView

### Step 3: Run Your App
```bash
yarn android
```

### Step 4: Check DebugView
You should see events appearing in real-time!

## 📊 View Data in Firebase Console

### Immediate (DebugView)
- Real-time event tracking
- See all parameters instantly
- Perfect for testing

### 24-48 Hours (Events Dashboard)
1. Analytics → Events
2. Look for:
   - `campaign_attribution`
   - `campaign_deep_link`
3. Click event name for details

### Create Dashboard
1. Analytics → Dashboard
2. Add cards for:
   - Campaign attribution count
   - Media source breakdown
   - Campaign performance

## 📝 Example Usage in Your App

### Track Campaign Attribution (Already Implemented)
```typescript
await logCampaignAttribution({
  mediaSource: 'facebook',
  campaignName: 'summer_promo',
  referralCode: 'FB123',
  deviceToken: 'abc123',
  influencerId: 'influencer_1',
});
```

### Track User Actions
```typescript
// User signs up
await logSignUp('google');

// User completes lesson
await logLessonComplete('lesson_1', 'Basic Chinese', 95, 180);

// User makes purchase
await logPurchase({
  value: 9.99,
  currency: 'USD',
  itemId: 'premium_monthly',
  itemName: 'Premium Subscription',
});
```

## 🎯 What You'll See in Firebase

### Campaign Attribution Event
```
Event: campaign_attribution
Parameters:
  - media_source: "facebook"
  - campaign_name: "summer_promo"
  - referral_code: "FB123"
  - device_token: "abc123"
  - influencer_id: "influencer_1"
  - is_first_launch: true
  - timestamp: "2024-11-14T10:30:00Z"
```

### Deep Link Event
```
Event: campaign_deep_link
Parameters:
  - media_source: "instagram"
  - campaign_name: "influencer_promo"
  - referral_code: "INF456"
  - device_token: "xyz789"
  - influencer_id: "john_doe"
  - is_deep_link: true
  - timestamp: "2024-11-14T10:35:00Z"
```

## 🔍 Key Analytics Questions You Can Answer

1. **Which marketing channel brings the most users?**
   - View `media_source` parameter breakdown

2. **Which campaign is most effective?**
   - View `campaign_name` parameter breakdown

3. **How many influencer-driven installs?**
   - Filter by `influencer_id` (not empty)

4. **Attribution over time?**
   - View event count time series

5. **User engagement after install?**
   - Create funnel: install → signup → lesson complete

## 🛠️ Available Helper Functions

Import from: `src/core/presentation/utils/analyticsHelper.ts`

```typescript
import {
  logCampaignAttribution,
  logCampaignDeepLink,
  logSignUp,
  logLogin,
  logPurchase,
  logLessonStart,
  logLessonComplete,
  logAchievementUnlocked,
  logLevelUp,
  setUserId,
  setUserProperty,
} from 'src/core/presentation/utils/analyticsHelper';
```

## 📈 Next Steps

1. **Test Now** (5 min)
   - Enable debug mode
   - Run app
   - Check DebugView

2. **Wait 24 Hours**
   - Check Events Dashboard
   - See production data

3. **Create Dashboard**
   - Add key metrics
   - Monitor campaigns

4. **Integrate More Events**
   - Track lesson completion
   - Track user achievements
   - Track purchases

5. **Analyze & Optimize**
   - Compare campaign performance
   - Identify best channels
   - Optimize marketing spend

## 🔗 Resources

- **Main Guide**: `FIREBASE_ANALYTICS_GUIDE.md`
- **Testing Guide**: `FIREBASE_ANALYTICS_TESTING.md`
- **Helper Functions**: `src/core/presentation/utils/analyticsHelper.ts`
- **Firebase Docs**: https://firebase.google.com/docs/analytics

## 💡 Pro Tips

1. **Always test in DebugView first** - Don't wait 24 hours to find bugs
2. **Use consistent naming** - Stick to lowercase_with_underscores
3. **Log meaningful events** - Focus on business-critical actions
4. **Set user properties** - Better segmentation and analysis
5. **Monitor regularly** - Weekly check-ins to catch issues early

## ❓ Common Questions

**Q: How long until I see data?**
A: DebugView is instant, Events Dashboard takes 24-48 hours.

**Q: Can I test without affecting production data?**
A: Yes! Use DebugView with debug mode enabled.

**Q: How do I know if it's working?**
A: Check DebugView immediately after triggering an event.

**Q: What if events aren't appearing?**
A: Check console logs for errors, verify Firebase is initialized.

**Q: Can I export the data?**
A: Yes! Enable BigQuery integration for SQL queries.

## 🎉 You're All Set!

Your Firebase Analytics is now configured and ready to track campaign attribution. Start testing with DebugView and you'll see data flowing in real-time!
