import React, {useEffect} from 'react';
import crashlytics from '@react-native-firebase/crashlytics';

const FirebaseCrashlyticProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useEffect(() => {
    console.log(
      '🛠 LOG: 🚀 --> --------------------------------------------------------------------------------------------🛠 LOG: 🚀 -->',
    );
    console.log(
      '🛠 LOG: 🚀 --> ~ file: FirebaseCrashlyticProvider.tsx:13 ~ useEffect ~ useEffect:',
      useEffect,
    );
    console.log(
      '🛠 LOG: 🚀 --> --------------------------------------------------------------------------------------------🛠 LOG: 🚀 -->',
    );

    // Enable Crashlytics collection
    crashlytics().setCrashlyticsCollectionEnabled(true);

    // Log app start
    crashlytics().log('App started');

    // Set user identifier
    crashlytics().setUserId('12345');

    // Set custom keys
    crashlytics().setAttribute('role', 'admin');
    crashlytics().setAttributes({
      framework: 'React Native',
      version: '1.0.0',
    });

    // Monitor app state
    const monitorAppState = () => {
      crashlytics().log('Monitoring app state');
      // Add more monitoring logic here
    };

    monitorAppState();
  }, []);

  return <>{children}</>;
};

export default FirebaseCrashlyticProvider;
