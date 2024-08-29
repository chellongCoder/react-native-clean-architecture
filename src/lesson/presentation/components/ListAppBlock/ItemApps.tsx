import {View, Text, StyleSheet, Switch} from 'react-native';
import React, {useEffect, useState} from 'react';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';

export type PropsItemApps = {
  preFixIcon?: React.ReactNode;
  title?: string;
  subTitle?: string;
  active?: boolean;
  onChange?: (id: string, status: boolean) => void;
};

export type AppItem = {
  title: string;
  subTitle: string;
  preFixIcon: any;
  apkFilePath: string;
};

const ItemApps = ({
  preFixIcon,
  title = '',
  subTitle = '',
  active = false,
  onChange,
  apkFilePath,
}: PropsItemApps & AppItem) => {
  const globalStyle = useGlobalStyle();

  const [value, setValue] = useState(active);

  useEffect(() => {
    setValue(active);
  }, [active]);

  const onChangeValue = (v: boolean) => {
    setValue(v);
    if (v) {
      onChange?.(subTitle, v);
    } else {
      onChange?.(subTitle, v);
    }
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
        onChange={e => {
          onChangeValue(e.nativeEvent.value);
        }}
      />
    </View>
  );
};

export default ItemApps;

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
  permissionItem: {
    borderRadius: scale(12),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    marginTop: verticalScale(5),
    backgroundColor: COLORS.GREEN_DDF598,
  },
});
