import React, {forwardRef, useCallback} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {SharedValue} from 'react-native-reanimated';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {COLORS} from 'src/core/presentation/constants/colors';

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
          {backgroundColor: other.backgroundColor},
        ]}
        handleIndicatorStyle={styles.handleIndicatorStyle}
        backdropComponent={renderBackdrop}
        {...other}>
        <BottomSheetView style={[styles.contentContainer]}>
          {title && (
            <View style={[styles.pb8]}>
              <Text style={[globalStyle.txtLabel, styles.txtTitle]}>
                {title}
              </Text>
            </View>
          )}
          {children}
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

const styles = StyleSheet.create({
  contentContainer: {
    // flex: 1,
    alignItems: 'center',
  },
  txtTitle: {
    color: 'white',
  },
  pb8: {
    paddingBottom: 12,
  },
  handleStyle: {
    backgroundColor: 'transparent',
  },
  backgroundStyle: {
    backgroundColor: COLORS.GREEN_66C270,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 14,
  },
  handleIndicatorStyle: {
    height: 0,
  },
});

export default BottomSheetCustom;
