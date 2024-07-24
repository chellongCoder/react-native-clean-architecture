import React, {FC, Fragment, useRef} from 'react';
import {Platform, View, StatusBar} from 'react-native';
import styles from '../styles';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {COLORS} from 'src/core/presentation/constants/colors';
import TabButton from './TabButton';

interface CustomStatusBarProps {
  backgroundColor: string;
  barStyle?: 'default' | 'light-content' | 'dark-content';
}

const CustomStatusBar: FC<CustomStatusBarProps> = ({
  backgroundColor,
  barStyle,
}) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{height: insets.bottom, backgroundColor}}>
      <StatusBar
        animated={true}
        barStyle={barStyle}
        backgroundColor={backgroundColor}
      />
    </View>
  );
};

function BottomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps): React.ReactElement | null {
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  const insets = useSafeAreaInsets();

  const routesView = useRef(
    Array.from({length: state.routes.length}, (_, i) => i),
  );

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <Fragment>
      <View style={[styles.blockRoutes, {paddingBottom: insets.bottom}]}>
        {Platform.OS === 'android' && (
          <View style={styles.blockRoutesContainer} />
        )}
        <View style={[styles.midBackground]} />
        {state?.routes.map((route: any, index: number) => {
          const {options} = descriptors[route.key];

          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              const temp =
                routesView.current[Math.floor(state?.routes.length / 2 ?? 1)];
              const viewIndex = routesView.current.findIndex(i => i === index);
              routesView.current[2] = routesView.current[viewIndex];
              routesView.current[viewIndex] = temp;
              navigation.navigate(route.name);
            }
          };

          return (
            <TabButton
              key={index}
              options={options}
              onPress={onPress}
              route={route}
              isFocused={isFocused}
              numberOfTab={state?.routes}
              viewIndex={routesView.current.findIndex(i => i === index)}
            />
          );
        })}
      </View>
      <CustomStatusBar
        backgroundColor={COLORS.BLUE_258F78}
        barStyle="light-content"
      />
    </Fragment>
  );
}

export default BottomTabBar;
