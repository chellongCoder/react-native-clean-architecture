import * as Font from 'expo-font';
import {useEffect, useState} from 'react';

export enum FontFamily {
  BorelRegular = 'BorelRegular',
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
          [FontFamily.BorelRegular]: require('../../../../assets/fonts/borel_regular.ttf'),
          [FontFamily.Eina01Regular]: require('../../../../assets/fonts/eina_01_regular.ttf'),
          [FontFamily.Eina01Bold]: require('../../../../assets/fonts/eina_01_bold.ttf'),
          [FontFamily.SVNCherishMoment]: require('../../../../assets/fonts/svn_cherish_moment.ttf'),
          [FontFamily.SVNNeuzeitRegular]: require('../../../../assets/fonts/svn_neuzeit_regular.otf'),
          [FontFamily.SVNNeuzeitBold]: require('../../../../assets/fonts/svn_neuzeit_bold.otf'),
        });
        console.log('Fonts loaded successfully ✅');
      } catch (error) {
        console.log('Fonts loaded failed ❌', error);
      }
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  return fontsLoaded;
};
