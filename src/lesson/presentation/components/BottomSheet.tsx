import React, {forwardRef, useCallback} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetProps,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {SharedValue} from 'react-native-reanimated';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {COLORS} from 'src/core/presentation/constants/colors';
import {scale, verticalScale} from 'react-native-size-matters';
import BookView from './BookView';

type Props = {
  title?: string;
  children?: React.ReactNode;
  snapPoints?:
    | (string | number)[]
    | SharedValue<(string | number)[]>
    | Readonly<(string | number)[] | SharedValue<(string | number)[]>>
    | undefined;
  backgroundColor?: string;
  onBackdropPress?: () => void;
  onDone?: () => void;
} & BottomSheetProps;

const BottomSheetCustom = forwardRef<BottomSheet, Props>(
  ({title = '', children, snapPoints, ...other}: Props, ref) => {
    const globalStyle = useGlobalStyle();

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          pressBehavior={other?.onBackdropPress ? 'collapse' : 'close'}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          onPress={
            other?.onBackdropPress
              ? other.onBackdropPress
              : () => {
                  const bottomSheetRef =
                    ref as React.RefObject<BottomSheetMethods>;
                  bottomSheetRef.current?.close();
                }
          }
        />
      ),
      [other.onBackdropPress, ref],
    );

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        enablePanDownToClose={true}
        enableHandlePanningGesture={true}
        enableDynamicSizing={true}
        enableOverDrag={true}
        snapPoints={snapPoints}
        handleStyle={styles.handleStyle}
        backgroundStyle={[
          styles.backgroundStyle,
          // {backgroundColor: other.backgroundColor},
        ]}
        handleIndicatorStyle={styles.handleIndicatorStyle}
        backdropComponent={renderBackdrop}
        {...other}>
        <BookView
          style={styles.fill}
          contentStyle={styles.contentStyle}
          colorBg={other.backgroundColor ?? COLORS.GREEN_66C270}>
          {title && (
            <View style={[styles.pb8]}>
              <Text style={[globalStyle.txtLabel, styles.txtTitle]}>
                {title}
              </Text>
              {other.onDone && (
                <TouchableOpacity onPress={other.onDone}>
                  <Text style={[globalStyle.txtLabel, styles.txtTitle]}>
                    {'Done'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <BottomSheetScrollView style={[styles.contentContainer]}>
            {children}
          </BottomSheetScrollView>
        </BookView>
      </BottomSheet>
    );
  },
);

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  contentStyle: {
    flex: 1,
    marginTop: 16,
    marginBottom: 0,
  },
  contentContainer: {
    height: 10,
    // flex: 1,
    // alignItems: 'center'
    // alignSelf: 'center',
  },
  txtTitle: {
    color: '#FBF8CC',
  },
  pb8: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  handleStyle: {
    backgroundColor: 'transparent',
  },
  backgroundStyle: {
    backgroundColor: 'transparent',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 14,
  },
  handleIndicatorStyle: {
    height: 0,
  },
});

export default BottomSheetCustom;
