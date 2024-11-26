import * as Font from 'expo-font';
import {useEffect, useState} from 'react';

export enum FontFamily {
  Eina01Regular = 'Eina-01-Regular',
  Eina01Bold = 'Eina-01-Bold',
  SVNCherishMoment = 'SVN-Cherish Moment',
  SVNNeuzeitRegular = 'SVN-Neuzeit Grotesk Regular',
  SVNNeuzeitBold = 'SVN-Neuzeit Grotesk Bold',
}
export const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          [FontFamily.Eina01Regular]: require('assets/fonts/eina-01-regular.ttf'),
          [FontFamily.Eina01Bold]: require('assets/fonts/eina-01-bold.ttf'),
          [FontFamily.SVNCherishMoment]: require('assets/fonts/SVN-Cherish Moment.ttf'),
          [FontFamily.SVNNeuzeitRegular]: require('assets/fonts/SVN-Neuzeit Grotesk Regular.otf'),
          [FontFamily.SVNNeuzeitBold]: require('assets/fonts/SVN-Neuzeit Grotesk Bold.otf'),
        });
        console.log('Fonts loaded successfully ✅');
      } catch (error) {
        console.log('Fonts loaded failed ❌');
      }
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  return fontsLoaded;
};