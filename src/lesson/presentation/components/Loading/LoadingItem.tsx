import React from 'react';
import {StyleSheet, View} from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';
import {scale, verticalScale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import {WIDTH_SCREEN} from 'src/core/presentation/utils';

const LoadingItem = () => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Skeleton
          isLoading
          animationDirection="horizontalRight"
          containerStyle={styles.iconContainer}
          boneColor={COLORS.WHITE_FFFBE3}
          highlightColor={COLORS.PRIMARY}
          layout={[
            {
              height: verticalScale(60),
              width: verticalScale(60),
              borderRadius: scale(10),
            },
            {
              height: verticalScale(92),
              width: WIDTH_SCREEN / 1.5,
              borderRadius: scale(10),
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: scale(30),
    height: verticalScale(92),
  },
  leftSection: {
    // flexDirection: 'row',
    // alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoadingItem;
