import {StyleSheet, View, Text, Switch} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import PrimaryButton from '../components/PrimaryButton';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {moderateScale} from 'react-native-size-matters';
import BottomSheetCustom from '../components/BottomSheet';

const ListAppScreen = () => {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  const icon = <View style={styles.iconBox} />;

  const listItem: PropsItemApps[] = [
    {
      title: 'YouTobe',
      subTitle: '19.20.33',
      preFixIcon: icon,
    },
    {title: 'Finder', subTitle: '19.20.33', preFixIcon: icon},
    {
      title: 'Service provider location',
      subTitle: '19.20.33',
      preFixIcon: icon,
    },
    {title: 'Link to windown', subTitle: '19.20.33', preFixIcon: icon},
    {title: 'Google', subTitle: '19.20.33', preFixIcon: icon},
    {title: 'Calendar', subTitle: '19.20.33', preFixIcon: icon},
    {title: 'Facebook', subTitle: '19.20.33', preFixIcon: icon},
  ];

  return (
    <View style={[styles.fill, styles.justifyContentCenter]}>
      <PrimaryButton
        text="Mở bottom sheet"
        onPress={() => bottomSheetRef.current?.collapse()}
      />
      <BottomSheetCustom
        snapPoints={['50']}
        ref={bottomSheetRef}
        title="List Apps">
        {listItem.map((v, i) => (
          <ItemApps key={i} {...v} />
        ))}
      </BottomSheetCustom>
    </View>
  );
};

export default ListAppScreen;

type PropsItemApps = {
  preFixIcon?: React.ReactNode;
  title?: string;
  subTitle?: string;
  active?: boolean;
  onChange?: (a: boolean) => void;
};

const ItemApps = ({
  preFixIcon,
  title = '',
  subTitle = '',
  active = false,
  onChange,
}: PropsItemApps) => {
  const globalStyle = useGlobalStyle();

  const [value, setValue] = useState(active);

  useEffect(() => {
    setValue(active);
  }, [active]);

  const onChangeValue = (v: boolean) => {
    onChange ? onChange(v) : setValue(v);
  };

  return (
    <View style={styles.item}>
      {preFixIcon}
      {preFixIcon && <View style={styles.space8} />}
      <View style={styles.fill}>
        <Text style={[globalStyle.txtLabel, styles.txtTitle]}>{title}</Text>
        <Text style={[globalStyle.txtNote, styles.txtSubTitle]}>
          {subTitle}
        </Text>
      </View>
      <Switch
        value={value}
        onChange={e => onChangeValue(e.nativeEvent.value)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  item: {
    flexDirection: 'row',
    padding: 8,
    marginHorizontal: 8,
    marginBottom: 8,
    width: '95%',
    borderColor: '#AEAEAE',
    borderWidth: 1,
    borderRadius: 8,
  },
  txtTitle: {
    color: 'white',
    fontSize: moderateScale(12),
  },
  txtSubTitle: {
    color: 'white',
    fontSize: moderateScale(10),
  },
  space8: {
    width: 8,
    height: 8,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 36,
    overflow: 'hidden',
    backgroundColor: '#AEAEAE',
  },
});
