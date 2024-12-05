import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {scale} from 'react-native-size-matters';
import {CustomTextStyle} from 'src/core/presentation/constants/typography';
import {IMergedData} from './ListSubject';
import {HEIGHT_SCREEN, WIDTH_SCREEN} from 'src/core/presentation/utils';

const SubjectItem = ({
  item,
  animatedStyle,
  onSelectSubject,
}: {
  item: IMergedData;
  animatedStyle: any;
  onSelectSubject: (item: IMergedData) => void;
}) => {
  const scaleItem = useSharedValue(1);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const position = useSharedValue<'absolute' | 'relative' | undefined>(
    undefined,
  );

  const itemAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {scale: scaleItem.value},
        // {translateX: offsetX.value},
        // {translateY: offsetY.value},
      ],
    };
  });

  const handlePress = () => {
    // if (scaleItem.value === 1) {
    //   //   scaleItem.value = withSpring(WIDTH_SCREEN / scale(192)); // Assuming itemWidth is the original width of the item
    //   offsetX.value = withSpring(WIDTH_SCREEN / 2 - scale(192) / 2);
    //   offsetY.value = withSpring(HEIGHT_SCREEN / 2 - scale(192) / 2); // Assuming itemHeight is the original height of the item
    // } else {
    //   scaleItem.value = withSpring(1);
    //   offsetX.value = withSpring(0);
    //   offsetY.value = withSpring(0);
    // }
    onSelectSubject(item);
    // scaleItem.value = withSpring(1.5, {damping: 5}, () => {
    //   runOnJS(onSelectSubject)(item);
    // });
  };

  return (
    <Animated.View
      key={item.id}
      style={[styles.contentContainer, animatedStyle, itemAnimatedStyle]}>
      {item.position === 'right' && <View style={[{height: scale(132)}]} />}
      <TouchableOpacity
        style={[
          item.position === 'right'
            ? styles.rightContentContainer
            : styles.leftContentContainer,
          {backgroundColor: item.bgc},
        ]}
        onPress={() => handlePress()}>
        <Text style={[styles.itemTitle, {color: item.textColor}]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftContentContainer: {
    height: scale(142),
    width: scale(142),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
  },
  rightContentContainer: {
    height: scale(192),
    width: scale(192),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    position: 'absolute',
    right: 0,
  },
  itemTitle: {
    ...CustomTextStyle.h1_SVNCherishMoment,
    textTransform: 'uppercase',
  },
});

export default SubjectItem;
