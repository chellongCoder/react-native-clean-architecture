/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {TouchableOpacity, View} from 'react-native';
import React, {useEffect, useMemo, useRef} from 'react';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  // withSpring,
  withTiming,
} from 'react-native-reanimated';
import {useDragContext} from './DragProvider';

type Props = {
  index?: number;
  value: string;
  translateX?: SharedValue<number>;
  translateY?: SharedValue<number>;
  canSwap?: boolean;
  createItem: (params: {value: string; isFocus: boolean}) => React.ReactNode;
};

const DragItem = ({
  index = 0,
  value,
  translateX: tX,
  translateY: tY,
  canSwap = true,
  createItem,
}: // children,
Props) => {
  const {
    listDragItem,
    attachSendView,
    onDrag,
    onDragEnd,
    onAnimationEnd,
    rollback,
    getValue,
  } = useDragContext();

  const canDrag = useMemo(() => !tX && !tY, [tX, tY]);

  const ref = useRef<View>(null);

  const isFocus = useMemo(
    () => canDrag && listDragItem[index]?.isFocus,
    [canDrag, listDragItem[index]?.isFocus],
  );

  const translateX = useSharedValue(0.0);
  const translateY = useSharedValue(0.0);

  const pan = Gesture.Pan()
    .onChange(e => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
      runOnJS(onDrag)(index);
    })
    .onFinalize(() => {
      translateX.value = withTiming(0, {duration: 200}, () => {
        runOnJS(onAnimationEnd)(index);
      });
      translateY.value = withTiming(0, {duration: 200});
      runOnJS(onDragEnd)(index);
    });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: withTiming(tX?.value ?? translateX.value, {duration: 0})},
        {translateY: withTiming(tY?.value ?? translateY.value, {duration: 0})},
      ],
    };
  });

  const attachView = (x: number, y: number) => {
    if (canDrag) {
      attachSendView({
        id: index,
        value: getValue(index) || value,
        posX: x,
        posY: y,
        translateX: translateX,
        translateY: translateY,
        isFocus: listDragItem[index]?.isFocus ?? false,
        isSelected: listDragItem[index]?.isSelected ?? false,
        isMatch: listDragItem[index]?.isMatch ?? false,
        parentId: listDragItem[index]?.parentId ?? -1,
        canSwap: canSwap,
        createItem: createItem,
      });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      ref.current?.measureInWindow((x, y, width, height) => {
        console.log('measureInWindow ', value, x, y, width, height);
        attachView(x, y);
      });
    }, 300);
  }, [value]);

  return (
    <GestureHandlerRootView
      // style={{zIndex: 100000}}
      pointerEvents={canDrag ? 'auto' : 'none'}>
      {canDrag && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            opacity:
              isFocus ||
              listDragItem[index]?.isSelected ||
              listDragItem[index]?.isMatch
                ? 0.5
                : 1,
          }}
          pointerEvents={listDragItem[index]?.parentId > -1 ? 'auto' : 'none'}>
          <TouchableOpacity
            onPress={() => {
              rollback(index);
            }}>
            {createItem({
              value: getValue(index) || value,
              isFocus: false,
            })}
          </TouchableOpacity>
        </View>
      )}
      <GestureDetector
        gesture={
          !listDragItem[index]?.isSelected && !canSwap ? pan : Gesture.Pan()
        }>
        <Animated.View
          ref={ref}
          style={[animatedStyles]}
          pointerEvents={
            listDragItem[index]?.parentId > -1 ? 'none' : 'box-only'
          }
          onLayout={e => {
            if (canDrag) {
              e.target.measureInWindow((x, y, width, height) => {
                console.log('measureInWindow ', value, x, y, width, height);
                attachView(x, y);
              });
            }
          }}>
          <View style={{opacity: canDrag ? 0 : 1}}>
            {createItem({value: listDragItem[index]?.value, isFocus: false})}
          </View>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default React.memo(DragItem);
