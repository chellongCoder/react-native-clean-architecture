import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import {scale} from 'react-native-size-matters';
import ICManIcon from 'src/core/components/icons/ICManIcon';
import ICStarInformation from 'src/core/components/icons/ICStarInformation';
import {COLORS} from 'src/core/presentation/constants/colors';
import {CustomTextStyle} from 'src/core/presentation/constants/typography';
import Top3Rank from './Top3Rank';
import BookView from 'src/lesson/presentation/components/BookView';
import useRanking from 'src/lesson/presentation/hooks/useRanking';
import TopRankingEntity from 'src/lesson/domain/entities/TopRankingEntity';
import {assets} from 'src/core/presentation/utils';

const screenWidth = Dimensions.get('screen').width;

export type TInformationBoardData = {
  id: number;
  star: number;
  username: string;
};

const Top50Rank = () => {
  const {topRanking} = useRanking();

  const top3 = topRanking.slice(0, 3);

  const remainingData = topRanking.slice(3);

  const renderInformationBoardItem = ({
    item,
    index,
  }: {
    item: TopRankingEntity;
    index: number;
  }) => {
    return (
      <View style={styles.wrapContentContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.wrapHeaderContentContainer}>
            <View style={styles.IDContainer}>
              <ICStarInformation />
              <View style={styles.wrapIDContainer}>
                <Text style={styles.title}>{index + 4}</Text>
              </View>
            </View>
            <View style={styles.wrapUseContainer}>
              <View style={styles.wrapAvatarContainer}>
                <ICManIcon />
              </View>
              <Text style={styles.username}>{item?.user?.name ?? ''}</Text>
            </View>
          </View>
          <View style={styles.wrapStarContainer}>
            <Image
              source={assets.untitled_artwork}
              style={styles.star}
              resizeMode="contain"
            />
            <Text style={styles.starText}>{item.totalPoint}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <BookView style={styles.container} contentStyle={styles.content}>
      {/* <View style={styles.square} /> */}
      <View style={styles.wrapTitleContainer}>
        <Text style={styles.title}>Top 50 Rank</Text>
      </View>
      <ScrollView>
        <View style={styles.wrapInformationBoardContainer}>
          <View style={styles.wrapTop3Container}>
            <Top3Rank data={top3} />
          </View>
          <View>
            <FlatList
              data={remainingData}
              renderItem={renderInformationBoardItem}
            />
          </View>
        </View>
      </ScrollView>
    </BookView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: scale(40),
    borderTopRightRadius: scale(40),
    paddingTop: scale(32),
    paddingHorizontal: scale(16),
  },
  content: {
    marginTop: 0,
    marginRight: 0,
    flex: 1,
    paddingBottom: scale(54),
  },
  wrapTop3Container: {
    // flex: 1,
  },
  square: {
    height: scale(24),
    width: scale(24),
    backgroundColor: COLORS.WHITE_FFFBE3,
    position: 'absolute',
    left: screenWidth / 2 - scale(12),
    transform: [{rotate: '45deg'}],
    top: scale(-12),
  },
  wrapTitleContainer: {
    marginLeft: scale(24),
  },
  title: {
    ...CustomTextStyle.body1_bold,
    color: COLORS.BLUE_1C6349,
  },
  wrapInformationBoardContainer: {
    flex: 1,
    marginVertical: scale(16),
    backgroundColor: COLORS.WHITE_FBF8CC,
    borderRadius: scale(24),
  },
  wrapContentContainer: {
    paddingHorizontal: scale(24),
  },
  contentContainer: {
    borderBottomWidth: scale(1.5),
    paddingVertical: scale(12),
    borderBottomColor: COLORS.CUSTOM(COLORS.BLUE_1C6349, 0.8),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wrapHeaderContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  IDContainer: {alignItems: 'center', justifyContent: 'center'},
  wrapIDContainer: {
    position: 'absolute',
  },
  wrapUseContainer: {
    marginLeft: scale(12),
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapAvatarContainer: {
    height: scale(34),
    width: scale(34),
    backgroundColor: COLORS.YELLOW_F2B559,
    marginRight: scale(12),
    borderRadius: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    ...CustomTextStyle.caption,
    color: COLORS.BLUE_1C6349,
    textDecorationLine: 'underline',
  },
  wrapStarContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(8),
    borderWidth: 2,
    borderRadius: scale(20),
    borderColor: COLORS.GREEN_66C270,
  },
  star: {
    width: 24,
    height: 24,
    marginLeft: -4,
  },
  starText: {
    marginLeft: scale(2),
    ...CustomTextStyle.smallBold,
    color: COLORS.GREEN_66C270,
  },
});

export default Top50Rank;
