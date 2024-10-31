import React, {useContext, useEffect} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import {CustomTextStyle} from 'src/core/presentation/constants/typography';
import {HomeContext} from '../stores/HomeContext';
import {FieldData} from 'src/home/application/types/GetFieldResponse';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

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
      <Animated.View
        key={index}
        style={[styles.contentContainer, animatedStyle]}>
        {item.position === 'right' && (
          <View style={[styles.container, {height: scale(132)}]} />
        )}
        <TouchableOpacity
          style={[
            item.position === 'right'
              ? styles.rightContentContainer
              : styles.leftContentContainer,
            {backgroundColor: item.bgc},
          ]}
          onPress={() => onSelectSubject(item)}>
          <Text style={[styles.itemTitle, {color: item.textColor}]}>
            {item.name}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={mergedData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: scale(54)}}
      />
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
    position: 'absolute',
    right: 0,
  },
  itemTitle: {
    ...CustomTextStyle.h1_SVNCherishMoment,
    textTransform: 'uppercase',
  },
});

export default ListSubject;
