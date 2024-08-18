import Color from 'color';
export const COLORS = {
  PRIMARY: '#66C270',

  WHITE: '#FFFFFF',
  BLACK: '#000000',
  TRANSPARENT: 'transparent',
  BACKGROUND: '#1C1C1E',
  DISABLED: '#808080',
  TITLE: '#002D2D',
  ERROR: '#FF3B30',
  BACKGROUND_FADE: '#121212',
  CUSTOM: (c: string, opacity: number) => Color(c).fade(opacity).string(),
  PRIMARY_15: '#01F7F726',
  Linear_Ranking_1: '#001B43CC',
  Linear_Ranking_2: '#1C1C1E',
  BLACK_1: '#01F7F700',
  YELLOW_FBE86B: '#FBE86B',
  YELLOW_E6960B: '#E6960B',
  GREEN_66C270: '#66C270',
  YELLOW_F2B559: '#F2B559',
  RED_F28759: '#F28759',
  BLUE_A3F0DF: '#A3F0DF',
  WHITE_FBF8CC: '#FBF8CC',
  BLUE_258F78: '#258F78',
  GREEN_1C6349: '#1C6349',
  WHITE_FFFBE3: '#FFFBE3',
  BLUE_1C6349: '#1C6349',
  WHITE_FFE699: '#FFE699',
  BLUE_3AB89C: '#3AB89C',
  PINK_FFB29F: '#FFB29F',
  YELLOW_FFBF60: '#FFBF60',
  GREEN_DDF598: '#DDF598',
  BLUE_78C5B4: '#78C5B4',
  GREEN_1C6A59: '#1C6A59',
  ORANGE_E5592C: '#E5592C',
  GREEN_009C6F: '#009C6F',
  BLUE_20A7FF: '#20A7FF',
  PURPLE_BD7FF5: '#BD7FF5',
};
