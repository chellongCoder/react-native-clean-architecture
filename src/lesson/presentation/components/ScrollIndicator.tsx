/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState} from 'react';
import {
  View,
  ScrollView,
  Animated,
  StyleSheet,
  ViewStyle,
  LayoutChangeEvent,
} from 'react-native';

interface ScrollIndicatorProps {
  containerStyle?: ViewStyle;
  indicatorStyle?: ViewStyle;
  scrollViewStyle?: ViewStyle;
  indicatorColor?: string;
  horizontal?: boolean;
  children: React.ReactNode;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  containerStyle,
  indicatorStyle,
  scrollViewStyle,
  indicatorColor = '#003c82',
  horizontal = true,
  children,
}) => {
  const scrollIndicator = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  // Add state for viewport and content dimensions
  const [viewportDimension, setViewportDimension] = useState(0);
  const [contentDimension, setContentDimension] = useState(0);

  // Calculate indicator size based on viewport ratio
  const getIndicatorSize = (): `${number}%` => {
    if (contentDimension <= viewportDimension) {
      return '100%';
    }
    const ratio = viewportDimension / contentDimension;
    return `${ratio * 100}%`;
  };

  const indicatorSize = getIndicatorSize();

  // Calculate indicator translation range
  const getTranslationRange = () => {
    if (contentDimension <= viewportDimension) {
      return 0;
    }
    const availableSpace =
      viewportDimension -
      viewportDimension * (viewportDimension / contentDimension);
    return availableSpace;
  };

  const handleScroll = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: horizontal
            ? {x: scrollIndicator}
            : {y: scrollIndicator},
        },
      },
    ],
    {useNativeDriver: false},
  );

  const handleLayout = (event: LayoutChangeEvent) => {
    const dimension = horizontal
      ? event.nativeEvent.layout.width
      : event.nativeEvent.layout.height;
    setViewportDimension(dimension);
  };

  const handleContentSizeChange = (width: number, height: number) => {
    const dimension = horizontal ? width : height;
    setContentDimension(dimension);
  };

  return (
    <View style={[styles.container, containerStyle]} onLayout={handleLayout}>
      <ScrollView
        ref={scrollRef}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        onContentSizeChange={handleContentSizeChange}
        scrollEventThrottle={16}
        style={[
          styles.scrollView,
          scrollViewStyle,
          {
            marginRight: horizontal ? 0 : 12,
            marginBottom: horizontal ? 12 : 0,
          },
        ]}>
        {children}
      </ScrollView>

      {contentDimension - viewportDimension > 0 && ( // Only show the indicator if there's scrollable content
        <View
          style={[
            styles.indicatorContainer,
            horizontal ? styles.horizontalIndicator : styles.verticalIndicator,
            indicatorStyle,
          ]}>
          <Animated.View
            style={[
              styles.indicator,
              {},
              {
                width: horizontal ? indicatorSize : 4,
                height: horizontal ? 4 : indicatorSize,
                backgroundColor: indicatorColor,
                transform: [
                  horizontal
                    ? {
                        translateX: scrollIndicator.interpolate({
                          inputRange: [0, contentDimension - viewportDimension],
                          outputRange: [0, getTranslationRange()],
                          extrapolate: 'clamp',
                        }),
                      }
                    : {
                        translateY: scrollIndicator.interpolate({
                          inputRange: [0, contentDimension - viewportDimension],
                          outputRange: [0, getTranslationRange()],
                          extrapolate: 'clamp',
                        }),
                      },
                ],
              },
            ]}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  indicatorContainer: {
    backgroundColor: '#003c82',
    margin: 8,
    borderRadius: 10,
  },
  horizontalIndicator: {
    height: 2,
    width: '100%',
    marginHorizontal: 16,
  },
  verticalIndicator: {
    width: 2,
    height: '100%',
    position: 'absolute',
    right: 2,
    top: 0,
  },
  indicator: {
    marginLeft: -1,
    backgroundColor: '#003c82',
    borderRadius: 10,
  },
});

export default ScrollIndicator;
