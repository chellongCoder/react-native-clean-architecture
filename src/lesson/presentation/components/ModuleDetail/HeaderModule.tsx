import React from 'react';
import {View, Text, StyleSheet, Image, ImageSourcePropType} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import {assets} from 'src/core/presentation/utils';

type HeaderModuleProps = {
  lessonTitle: string;
  moduleTitle: string;
  modulePart: string;
  timer?: string;
  score?: number;
  scoreIcon?: ImageSourcePropType;
};

const HeaderModule = ({
  lessonTitle,
  moduleTitle,
  modulePart,
  timer = '00:00',
  score = 0,
  scoreIcon = assets.abcBook,
}: HeaderModuleProps) => {
  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Text style={styles.lessonTitle}>{lessonTitle}</Text>
        <View style={styles.divider} />
        <View style={styles.moduleInfoContainer}>
          <Text style={styles.moduleTitle}>{moduleTitle}</Text>
          <Text style={styles.modulePart}>{modulePart}</Text>
        </View>
      </View>

      <View style={styles.rightHeaderContainer}>
        {/* Timer */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{timer}</Text>
        </View>

        {/* Score */}
        <View style={styles.scoreContainer}>
          <Image source={scoreIcon} style={styles.flowerIcon} />
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '60%',
  },
  lessonTitle: {
    fontFamily: FontFamily.SVNCherishMoment,
    fontSize: scale(24),
    color: '#9B2226',
    marginRight: scale(5),
  },
  divider: {
    height: verticalScale(20),
    width: scale(3),
    backgroundColor: '#9B2226',
    borderRadius: scale(10),
    marginHorizontal: scale(8),
  },
  moduleInfoContainer: {
    marginLeft: scale(4),
  },
  moduleTitle: {
    fontSize: scale(10),
    color: '#9B2226',
    fontWeight: '600',
  },
  modulePart: {
    fontSize: scale(8),
    color: '#9B2226',
  },
  rightHeaderContainer: {
    alignItems: 'flex-end',
  },
  timerContainer: {
    backgroundColor: '#65C18C',
    paddingHorizontal: scale(15),
    paddingVertical: scale(5),
    borderRadius: scale(20),
    marginBottom: scale(5),
  },
  timerText: {
    color: 'white',
    fontSize: scale(14),
    fontWeight: '600',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: scale(20),
    paddingHorizontal: scale(10),
    paddingVertical: scale(5),
  },
  flowerIcon: {
    width: scale(20),
    height: scale(20),
    marginRight: scale(5),
  },
  scoreText: {
    color: '#65C18C',
    fontWeight: '600',
  },
});

export default HeaderModule;
