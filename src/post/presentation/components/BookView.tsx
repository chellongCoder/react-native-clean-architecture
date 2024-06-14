import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import React from 'react';
import IconBookBg from 'assets/svg/IconBookBg';

const BookView = ({
  style,
  children,
}: {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}) => {
  return (
    <View style={[style]}>
      <View style={[styles.view]}>
        <IconBookBg height={3000} />
      </View>
      <View style={[styles.content]}>{children}</View>
    </View>
  );
};

export default BookView;

const styles = StyleSheet.create({
  view: {
    position: 'absolute',
    height: '100%',
    overflow: 'hidden',
  },
  content: {
    marginTop: 36,
    marginBottom: 8,
  },
});
