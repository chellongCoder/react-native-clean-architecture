import React from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import {CustomTextStyle} from 'src/core/presentation/constants/typography';
import {STACK_NAVIGATOR} from 'src/core/presentation/navigation/ConstantNavigator';
import {navigateScreen} from 'src/core/presentation/navigation/actions/RootNavigationActions';

export type TDataItem = {
  id: number | string;
  position: 'left' | 'right';
  subject: string;
  bgc: string;
  textColor: string;
};

type TData = TDataItem[];

const ListSubject = () => {
  const data: TData = [
    {
      id: 1,
      position: 'left',
      subject: 'Science',
      bgc: COLORS.BLUE_3AB89C,
      textColor: COLORS.YELLOW_FFBF60,
    },
    {
      id: 2,
      position: 'right',
      subject: 'Language',
      bgc: COLORS.YELLOW_F2B559,
      textColor: COLORS.WHITE_FBF8CC,
    },
    {
      id: 3,
      position: 'left',
      subject: 'Story',
      bgc: COLORS.PINK_FFB29F,
      textColor: COLORS.WHITE_FBF8CC,
    },
    {
      id: 4,
      position: 'right',
      subject: 'Mathematics',
      bgc: COLORS.BLUE_258F78,
      textColor: COLORS.YELLOW_FFBF60,
    },
    {
      id: 5,
      position: 'left',
      subject: 'Health',
      bgc: COLORS.GREEN_66C270,
      textColor: COLORS.WHITE_FBF8CC,
    },
  ];

  const onSelectSubject = (subject: string) => {
    navigateScreen(STACK_NAVIGATOR.HOME.SUBJECT_SCREEN, {subject});
  };

  const renderItem = ({item, index}: {item: TDataItem; index: number}) => {
    return (
      <View key={index} style={[styles.contentContainer]}>
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
          onPress={() => onSelectSubject(item.subject)}>
          <Text style={[styles.itemTitle, {color: item.textColor}]}>
            {item.subject}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
