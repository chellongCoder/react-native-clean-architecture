import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import ICStar from 'src/core/components/icons/ICStar';
import {COLORS} from 'src/core/presentation/constants/colors';
import {CustomTextStyle} from 'src/core/presentation/constants/typography';
import CustomSwitch from './CustomSwitch';

type TProps = {
  title?: string;
  subject?: string;
};

const AccountStatus = (props: TProps) => {
  const {title, subject} = props;

  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {title ? (
          <View>
            <Text style={styles.title}>{title}</Text>
          </View>
        ) : (
          <View style={{flex: 1}} />
        )}
        <CustomSwitch value={isEnabled} onValueChange={setIsEnabled} />
      </View>
      <View style={styles.iconContainer}>
        {subject ? (
          <View>
            <Text style={styles.subTitle}>{subject}</Text>
          </View>
        ) : (
          <View style={{flex: 1}} />
        )}
        <View style={styles.wrapIconContainer}>
          <Text style={styles.text}>150</Text>
          <ICStar />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    width: '100%',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wrapIconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: scale(8),
  },
  title: {
    ...CustomTextStyle.h1_bold,
    color: COLORS.RED_F28759,
  },
  subTitle: {
    ...CustomTextStyle.h4_bold,
    color: COLORS.BLUE_258F78,
  },
  text: {
    ...CustomTextStyle.smallBold,
    color: COLORS.BLUE_1C6349,
    marginRight: scale(4),
  },
});

export default AccountStatus;
