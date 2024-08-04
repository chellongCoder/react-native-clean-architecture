import React from 'react';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import {scale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import ICManIconMedium from 'src/core/components/icons/ICManIconMedium';
import {CustomTextStyle} from 'src/core/presentation/constants/typography';
// import ICStarMedium from 'src/core/components/icons/ICStarMedium';
import {assets} from 'src/core/presentation/utils';
import TopRankingEntity from 'src/lesson/domain/entities/TopRankingEntity';

const Top3Rank = ({data}: {data: TopRankingEntity[]}) => {
  const sortOrder = [2, 1, 3];
  // const sortedData = [...data].sort((a, b) => b?.totalPoint - a?.totalPoint);
  const finalArray = sortOrder.map(index => data[index - 1]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.wrapHeaderContainer}>
        {/* <ICStarMedium /> */}
        <Image source={assets.star} style={styles.star} resizeMode="contain" />
      </View>

      <View style={styles.wrapItemContainer}>
        {finalArray.map((item: TopRankingEntity, index: number) => {
          return (
            <View style={{justifyContent: 'flex-end'}}>
              <Text style={styles.title}>Top {sortOrder[index]}</Text>
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
              <Text style={styles.username}>{item?.user?.name ?? ''}</Text>
              <View style={styles.wrapStarContainer}>
                <Image
                  source={assets.untitled_artwork}
                  style={styles.flower}
                  resizeMode="contain"
                />
                <Text style={styles.starText}>{item?.totalPoint}</Text>
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
  },
  wrapHeaderContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 4,
  },
  wrapItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  title: {
    ...CustomTextStyle.body1_bold,
    color: '#fbf8cc',
    textAlign: 'center',
    marginBottom: scale(4),
  },
  star: {
    width: 48,
    height: 40,
  },
  flower: {
    width: 24,
    height: 24,
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
    ...CustomTextStyle.captionBold,
    color: COLORS.BLUE_1C6349,
    textAlign: 'center',
    marginVertical: scale(2),
    marginTop: scale(4),
  },
  wrapStarContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#fbf8cc',
    borderWidth: 2,
    borderRadius: 100,
    alignSelf: 'center',
    paddingHorizontal: scale(4),
  },
  starText: {
    marginRight: scale(2),
    ...CustomTextStyle.smallBold,
    color: '#fbf8cc',
  },
});

export default Top3Rank;
