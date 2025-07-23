import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  Text,
  ScrollView,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import {COLORS} from 'src/core/presentation/constants/colors';
import TextShadow from '../TextShadow';
import FastImage, {ImageStyle} from 'react-native-fast-image';

type Props = {
  title?: string;
  image?: string;
  imageStyle?: StyleProp<ImageStyle>;
  descriptions?: string[];
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  backgroundColor?: string;
  textShadowColor?: string;
};

const QuestionImageText = ({
  title,
  image,
  imageStyle,
  descriptions,
  containerStyle,
  contentContainerStyle,
  titleStyle,
  descriptionStyle,
  backgroundColor = '#E8F5E8',
  textShadowColor = 'rgba(0,0,0,0.3)',
}: Props) => {
  return (
    <View style={[styles.container, {backgroundColor}, containerStyle]}>
      {/* Title at the top */}
      {title && (
        <View style={styles.titleContainer}>
          <TextShadow
            style={[styles.title, titleStyle]}
            textShadowColor={textShadowColor}>
            {title}
          </TextShadow>
        </View>
      )}

      {/* Content container with image and text */}
      <View style={[styles.contentContainer, contentContainerStyle]}>
        {/* Image on the left */}
        {image && (
          <View style={styles.imageContainer}>
            <FastImage
              source={{uri: image}}
              style={[styles.image, imageStyle]}
              resizeMode="contain"
            />
          </View>
        )}

        {/* Text descriptions on the right */}
        {descriptions && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.textContainer}>
            {descriptions?.map((description, index) => (
              <View key={index} style={styles.descriptionItem}>
                <Text style={[styles.description, descriptionStyle]}>
                  {description}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: scale(16),
    padding: scale(16),
    minHeight: verticalScale(200),
    minWidth: scale(250),
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  title: {
    fontSize: scale(32),
    fontFamily: FontFamily.SVNCherishMoment,
    color: '#FF6B35',
    textTransform: 'uppercase',
    letterSpacing: scale(2),
  },
  contentContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    overflow: 'scroll',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(16),
  },
  image: {
    width: scale(120),
    height: scale(120),
  },
  textContainer: {
    flex: 1,
    // justifyContent: 'center',
  },
  descriptionItem: {
    marginBottom: verticalScale(12),
  },
  description: {
    fontSize: scale(16),
    fontFamily: FontFamily.SVNCherishMoment,
    color: COLORS.BLUE_258F78,
    lineHeight: scale(22),
  },
});

export default QuestionImageText;
