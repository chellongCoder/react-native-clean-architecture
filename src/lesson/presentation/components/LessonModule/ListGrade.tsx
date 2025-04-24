import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import {COLORS} from 'src/core/presentation/constants/colors';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';
import * as Haptics from 'expo-haptics';

const ListGrade = forwardRef((_, ref) => {
  const [index, setIndex] = useState<number | undefined>(0);
  const {setSubjectId, listSubject, rootSubject} = useHomeStore();

  const gradeObjs = useMemo(() => {
    return listSubject
      .filter(subject => subject.parentId === rootSubject?._id)
      .sort((a, b) => a.level - b.level); // * sắp xếp theo level
  }, [listSubject, rootSubject]);

  useImperativeHandle(ref, () => {
    return {
      getIndex: () => index,
      setIndex: setIndex,
    };
  });

  useEffect(() => {
    if (gradeObjs.length > 0 && gradeObjs) {
      setTimeout(() => {
        setIndex(0);
        setSubjectId(gradeObjs[0]._id);
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootSubject]);

  return (
    <View style={styles.container}>
      {gradeObjs.map(grade => {
        const words = grade.name.split(' ');
        return (
          <TouchableOpacity
            key={grade._id}
            style={
              index === gradeObjs.indexOf(grade)
                ? styles.itemActive
                : styles.item
            }
            onPress={() => {
              setIndex(gradeObjs.indexOf(grade));
              setSubjectId(grade._id);
              Haptics.selectionAsync();
            }}>
            <Text style={styles.txtItem}>
              {words?.[words.length - 1]?.charAt(0)}
            </Text>
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
