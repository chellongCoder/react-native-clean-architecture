import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import IconArrowFill from 'assets/svg/IconArrowFill';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import ItemCard from '../ItemCard';
import {scale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/utils/colors';
import {ScrollView} from 'react-native-gesture-handler';

const ListBlockedApps = ({
  listApp,
  setTabBody,
  selectedApp,
}: {
  listApp: {
    id: string;
    name: string;
    icon: any;
  }[];
  setTabBody: (id: string) => void;
  selectedApp: string;
}) => {
  const globalStyle = useGlobalStyle();
  return (
    <View style={[styles.rowBetween, styles.rowHCenter]}>
      <View style={[styles.arrowLeft]}>
        <IconArrowFill />
      </View>
      <ScrollView horizontal style={[styles.fill]}>
        {listApp.length ? (
          listApp.map(t => (
            <>
              <ItemCard
                key={t.id}
                Icon={t.icon}
                isFocus={selectedApp === t.name}
                name={t.name}
                onPress={() => setTabBody(t.name)}
                iconFocusColor="#F2B559"
                backgroundFocusColor="#FBF8CC"
                borderWidth={3}
                space={4}
                size={85}
              />
              <View style={{width: scale(10)}} />
            </>
          ))
        ) : (
          <View
            style={{
              width: '100%',
              alignItems: 'center',
            }}>
            <Text style={[globalStyle.txtNote, {color: COLORS.WHITE}]}>
              No blocked apps!
            </Text>
          </View>
        )}
      </ScrollView>
      <View style={[styles.arrowRight]}>
        <IconArrowFill type="right" />
      </View>
    </View>
  );
};

export default ListBlockedApps;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  rowHCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowRight: {
    marginLeft: scale(8),
  },
  arrowLeft: {
    marginRight: scale(8),
  },
});
