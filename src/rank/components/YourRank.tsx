import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {scale} from 'react-native-size-matters';
// import ICStarRank from 'src/core/components/icons/ICStarRank';
import {COLORS} from 'src/core/presentation/constants/colors';
import {CustomTextStyle} from 'src/core/presentation/constants/typography';
import {assets} from 'src/core/presentation/utils';
import useRanking from 'src/lesson/presentation/hooks/useRanking';

const YourRank = () => {
  const {rankingOfChild} = useRanking();

  return (
    <View style={styles.container}>
      <View style={styles.wrapContainer}>
        {/* <ICStarRank /> */}
        <Image source={assets.star} style={styles.icon} resizeMode="contain" />
        <View style={styles.wrapTitleRank}>
          <Text style={styles.titleRank}>{rankingOfChild ?? ''}</Text>
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
    width: 120,
    height: 120,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  wrapTitleRank: {
    position: 'absolute',
    top: 40,
  },
  titleRank: {
    ...CustomTextStyle.h1_SVNCherishMoment,
    color: '#AF3A1B',
  },
  yourRank: {
    ...CustomTextStyle.body1_bold,
    color: COLORS.BLUE_258F78,
  },
});

export default YourRank;
