import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import {COLORS} from 'src/core/presentation/constants/colors';

const ListGrade = forwardRef((_, ref) => {
  const grades = ['K', '1', '2', '3', '4', '5', '6'];
  const [index, setIndex] = useState<number | undefined>(0);

  useImperativeHandle(ref, () => {
    return {
      getIndex: () => index,
      setIndex: setIndex,
    };
  });

  return (
    <View style={styles.container}>
      {grades.map(grade => {
        return (
          <TouchableOpacity
            key={grade}
            style={
              index === grades.indexOf(grade) ? styles.itemActive : styles.item
            }
            onPress={() => setIndex(grades.indexOf(grade))}>
            <Text style={styles.txtItem}>{grade}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

export default ListGrade;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: scale(10),
    alignItems: 'center',
    paddingTop: verticalScale(10),
  },
  item: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    backgroundColor: '#F2B559',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtItem: {
    fontFamily: FontFamily.Eina01Bold,
    fontSize: scale(15),
    color: COLORS.WHITE,
  },
  itemActive: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(15),
    backgroundColor: COLORS.GREEN_66C270,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: scale(5),
    borderColor: COLORS.BLUE_258F78,
  },
});
