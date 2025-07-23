import React, {useState} from 'react';
import {StyleProp, Text, TouchableOpacity, View, ViewStyle} from 'react-native';
import FastImage from 'react-native-fast-image';
import {scale} from 'react-native-size-matters';
import {coreModuleContainer} from 'src/core/CoreModule';
import Env, {EnvToken} from 'src/core/domain/entities/Env';
import {COLORS} from 'src/core/presentation/constants/colors';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';

const ImageMeaningText = ({
  title,
  description,
  image,
  style,
  textColor,
}: {
  title?: string;
  description?: string;
  image?: string;
  style?: StyleProp<ViewStyle>;
  textColor?: string;
}) => {
  const env = coreModuleContainer.getProvided<Env>(EnvToken); // Instantiate CoreService

  const [isShowMeaning, setIsShowMeaning] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[
        {
          borderWidth: 5,
          backgroundColor: COLORS.CUSTOM(COLORS.WHITE_FBF8CC, 0.2),
          borderStyle: 'dashed',
          width: scale(150),
          height: scale(150),
          borderRadius: scale(20),
          borderColor: COLORS.YELLOW_F2B559,
          overflow: 'hidden',
        },
        style,
      ]}
      onPress={() => setIsShowMeaning(v => !v)}>
      {!isShowMeaning ? (
        <FastImage
          resizeMode={'contain'}
          style={[
            {
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              borderRadius: scale(20),
            },
          ]}
          source={{
            uri: env.IMAGE_QUESTION_BASE_API_URL + image,
          }}
        />
      ) : (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-evenly',
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: scale(25),
              fontFamily: FontFamily.SVNCherishMoment,
              color: textColor,
            }}>
            {title}
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: scale(14),
              fontFamily: FontFamily.SVNNeuzeitBold,
              color: textColor,
            }}>
            {description}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ImageMeaningText;
