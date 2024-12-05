import React, {useContext, useEffect} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import {CustomTextStyle} from 'src/core/presentation/constants/typography';
import {HomeContext} from '../../stores/HomeContext';
import {FieldData} from 'src/home/application/types/GetFieldResponse';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import SubjectItem from './SubjectItem';
import {HEIGHT_SCREEN, WIDTH_SCREEN} from 'src/core/presentation/utils';
import {Extrapolate} from '@shopify/react-native-skia';

export interface TDataItem {
  id: number | string;
  position: 'left' | 'right';
  bgc: string;
  textColor: string;
}

type TData = TDataItem[];

export interface IMergedData extends TDataItem, FieldData {}

const ListSubject = () => {
  const {homeState, onSelectField} = useContext(HomeContext);
  const data: TData = [
    {
      id: 1,
      position: 'left',
      bgc: COLORS.BLUE_3AB89C,
      textColor: COLORS.YELLOW_FFBF60,
    },
    {
      id: 2,
      position: 'right',
      bgc: COLORS.YELLOW_F2B559,
      textColor: COLORS.WHITE_FBF8CC,
    },
    {
      id: 3,
      position: 'left',
      bgc: COLORS.PINK_FFB29F,
      textColor: COLORS.WHITE_FBF8CC,
    },
    {
      id: 4,
      position: 'right',
      bgc: COLORS.BLUE_258F78,
      textColor: COLORS.YELLOW_FFBF60,
    },
  ];
  const scaleValue = useSharedValue(0.5);

  const selectedItemOpacity = useSharedValue(0);
  const selectedItemStyle = useAnimatedStyle(() => {
    return {
      opacity: selectedItemOpacity.value,
    };
  });

  const animatedScaleStyle = useAnimatedStyle(() => {
    const size =
      homeState.field?.position === 'right'
        ? styles.rightContentContainer
        : styles.leftContentContainer;
    const width = interpolate(
      selectedItemOpacity.value,
      [0, 1, 0],
      [0, size.width, WIDTH_SCREEN],
      Extrapolate.CLAMP,
    );
    const height = interpolate(
      selectedItemOpacity.value,
      [0, 1, 0],
      [0, size.height, WIDTH_SCREEN],
      Extrapolate.CLAMP,
    );
    return {
      width,
      height,
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scaleValue.value}],
    };
  });

  const mergedData = homeState?.listField?.map(
    (field: FieldData, index: number) => {
      const dataIndex = index % data.length; // Cycle through data array
      const dataItem = data[dataIndex];

      return {
        ...dataItem,
        ...field,
        bgc: dataItem.bgc,
        textColor: dataItem.textColor,
      };
    },
  );

  const onSelectSubject = (e: IMergedData) => {
    onSelectField(e);
  };

  useEffect(() => {
    if (mergedData?.length) {
      scaleValue.value = withSpring(1, {
        duration: 500,
        restSpeedThreshold: 0.5,
        dampingRatio: 0.3,
      });
    }
  }, [mergedData?.length, scaleValue]);

  const renderItem = ({item, index}: {item: IMergedData; index: number}) => {
    return (
      <SubjectItem
        key={index}
        item={item}
        animatedStyle={animatedStyle}
        onSelectSubject={onSelectSubject}
      />
    );
  };

  useEffect(() => {
    if (homeState.field) {
      selectedItemOpacity.value = withSpring(1, {duration: 500}, () => {
        selectedItemOpacity.value = withTiming(0, {duration: 500}, () => {
          runOnJS(onSelectField)(undefined);
        });
      });
    }
  }, [homeState.field, onSelectField, selectedItemOpacity]);

  return (
    <View style={styles.container}>
      <FlatList
        data={mergedData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: scale(54)}}
      />

      {homeState?.field ? (
        <Animated.View
          onResponderMove={() => {
            selectedItemOpacity.value = withTiming(0, {duration: 500});
          }}
          style={[
            selectedItemStyle,
            {
              position: 'absolute',
              backgroundColor: 'rgba(0,0,0,0.5)',
              height: HEIGHT_SCREEN,
              width: WIDTH_SCREEN,
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}>
          <Animated.View
            style={[
              animatedScaleStyle,
              homeState.field.position === 'right'
                ? styles.rightContentContainer
                : styles.leftContentContainer,
              {
                backgroundColor: homeState.field.bgc,
                marginBottom: verticalScale(50),
              },
            ]}>
            <Text
              style={[styles.itemTitle, {color: homeState.field.textColor}]}>
              {homeState.field.name}
            </Text>
          </Animated.View>
        </Animated.View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(16),
  },
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
  },
  itemTitle: {
    ...CustomTextStyle.h1_SVNCherishMoment,
    textTransform: 'uppercase',
  },
});

export default ListSubject;
