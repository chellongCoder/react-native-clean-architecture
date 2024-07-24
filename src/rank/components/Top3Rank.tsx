import React from 'react';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import {scale} from 'react-native-size-matters';
import {TInformationBoardData} from './Top50Rank';
import {COLORS} from 'src/core/presentation/constants/colors';
import ICManIconMedium from 'src/core/components/icons/ICManIconMedium';
import ICStarSmall from 'src/core/components/icons/ICStarSmall';
import {CustomTextStyle} from 'src/core/presentation/constants/typography';
// import ICStarMedium from 'src/core/components/icons/ICStarMedium';
import {assets} from 'src/core/presentation/utils';

const Top3Rank = ({data}: {data: TInformationBoardData[]}) => {
  const sortOrder = [2, 1, 3];
  const sortedData = [...data].sort((a, b) => b.star - a.star);
  const finalArray = sortOrder.map(index => sortedData[index - 1]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.wrapHeaderContainer}>
        {/* <ICStarMedium /> */}
        <Image source={assets.star} style={styles.star} resizeMode="contain" />
      </View>

      <View style={styles.wrapItemContainer}>
        {finalArray.map((item: TInformationBoardData, index: number) => {
          return (
            <View style={{justifyContent: 'flex-end'}}>
              <Text style={styles.title}>Top 1</Text>
              {index === 1 ? (
                <View
                  style={[
                    styles.wrapAvatarContainer,
                    {height: 120, width: 120},
                  ]}>
                  <View
                    style={[
                      styles.wrapAvatarContainer,
                      {
                        backgroundColor: COLORS.WHITE_FBF8CC,
                        height: 112,
                        width: 112,
                      },
                    ]}>
                    <ICManIconMedium color={COLORS.BLUE_1C6349} />
                  </View>
                </View>
              ) : (
                <View style={[styles.wrapAvatarContainer]}>
                  <ICManIconMedium />
                </View>
              )}
              <Text style={styles.username}>{item.username}</Text>
              <View style={styles.wrapStarContainer}>
                <Text style={styles.starText}>{item.star}</Text>
                <ICStarSmall />
              </View>
            </View>
          );
        })}
      </View>
      <View style={{height: scale(24)}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: scale(16),
    backgroundColor: COLORS.BLUE_78C5B4,
    paddingTop: scale(8),
    paddingBottom: scale(48),
  },
  wrapHeaderContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  wrapItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  title: {
    ...CustomTextStyle.body1_bold,
    color: COLORS.BLUE_1C6349,
    textAlign: 'center',
    marginBottom: scale(4),
  },
  star: {
    width: 28,
    height: 26,
  },
  wrapAvatarContainer: {
    height: 91,
    width: 91,
    backgroundColor: COLORS.YELLOW_F2B559,
    borderRadius: scale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    ...CustomTextStyle.caption,
    color: COLORS.BLUE_1C6349,
    textAlign: 'center',
  },
  wrapStarContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starText: {
    marginRight: scale(2),
    ...CustomTextStyle.smallBold,
    color: COLORS.BLUE_1C6349,
  },
});

export default Top3Rank;
