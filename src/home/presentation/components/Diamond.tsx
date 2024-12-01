import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS} from 'src/core/presentation/constants/colors';
import {TYPOGRAPHY} from 'src/core/presentation/constants/typography';
import {assets} from '../../../core/presentation/utils';

type TPros = {
  diamond?: number;
};

const Diamond = (props: TPros) => {
  const {diamond} = props;

  return (
    <View style={styles.container}>
      <View
        style={{
          position: 'absolute',
          zIndex: 999,
          left: -20,
          bottom: -8,
        }}>
        <Image
          source={assets.diamond}
          resizeMode="contain"
          style={styles.diamondContainer}
        />
      </View>

      <View
        style={{
          zIndex: 1,
        }}>
        <LinearGradient
          colors={['#FFE657', '#F17116', '#FFD900']} // Set the gradient colors
          style={[
            styles.linearBackgroundColor,
            {minWidth: 48, justifyContent: 'center'},
          ]} // Apply the gradient to the container
        >
          <View style={styles.wrapPriceContainer}>
            <Text style={styles.title}>{diamond ?? 0}</Text>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
  },
  diamondContainer: {
    height: 40,
    width: 40,
  },
  linearBackgroundColor: {
    borderRadius: 16,
  },
  wrapPriceContainer: {
    borderWidth: 1,
    borderColor: '#86E386',
    borderRadius: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  title: {
    color: COLORS.WHITE,
    textTransform: 'uppercase',
    fontFamily: TYPOGRAPHY.FAMILY.SVNCherishMoment,
  },
});

export default Diamond;
