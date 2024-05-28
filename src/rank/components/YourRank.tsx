import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import ICStarRank from 'src/core/components/icons/ICStarRank';
import {COLORS} from 'src/core/presentation/constants/colors';
import {CustomTextStyle} from 'src/core/presentation/constants/typography';

const YourRank = () => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapContainer}>
        <ICStarRank />
        <View style={styles.wrapTitleRank}>
          <Text style={styles.titleRank}>1</Text>
        </View>
      </View>
      <Text style={styles.yourRank}>Your Rank</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: scale(8),
    marginBottom: scale(16),
    alignItems: 'center',
  },
  wrapContainer: {
    width: 106,
    height: 106,
    backgroundColor: COLORS.GREEN_66C270,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(4),
  },
  wrapTitleRank: {
    position: 'absolute',
    top: 40,
  },
  titleRank: {
    ...CustomTextStyle.h2,
    color: COLORS.BLUE_1C6349,
  },
  yourRank: {
    ...CustomTextStyle.caption,
    color: COLORS.BLUE_258F78,
  },
});

export default YourRank;
