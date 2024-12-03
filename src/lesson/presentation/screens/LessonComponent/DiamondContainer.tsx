import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import {assets} from 'src/core/presentation/utils/assets';
import ItemCard from '../../components/ItemCard';
import {TYPOGRAPHY} from 'src/core/presentation/constants/typography';
import {COLORS} from 'src/core/presentation/constants/colors';
import {scale, verticalScale} from 'react-native-size-matters';
import {TProduct} from 'src/core/presentation/store/iapProvider';
import {IapContext} from 'src/core/presentation/store/iapContext';
import PrimaryButton from '../../components/PrimaryButton';

type TProps = {
  onBuyDiamond: (item: TProduct) => void;
};

const DiamondContainer = (props: TProps) => {
  const {onBuyDiamond} = props;
  const {iapState} = useContext(IapContext);

  const [itemIndex, setItemIndex] = useState(-1);

  return (
    <View style={styles.wrapDiamondPurchaseContainer}>
      <View style={styles.diamondPurchaseContainer}>
        <Text style={styles.purchaseHeaderTitle}>Diamonds purchase</Text>
      </View>

      <View style={styles.wrapDiamondPurchaseContentContainer}>
        <FlatList
          data={iapState.products?.sort(
            (a, b) => Number(a?.diamond) - Number(b?.diamond),
          )} // Sort products by price
          numColumns={3}
          columnWrapperStyle={styles.columnWrapperStyle}
          renderItem={({item, index}: {item: TProduct; index: number}) => {
            const isSecondRow = index >= 3 && index < 6; // Check if the item is in the second row
            const diamondImages = [
              assets.diamondLeaf,
              assets.diamondLeaf1,
              assets.diamondLeaf2,
              assets.diamondLeaf3,
              assets.diamondLeaf4,
              assets.diamondLeaf5,
            ];
            return (
              <View id={index?.toString()} style={styles.touchableOpacity}>
                <ItemCard
                  onPress={() => {
                    // onBuyDiamond(item);

                    setItemIndex(index);
                  }}
                  Icon={
                    <Image
                      source={assets.diamond_pack}
                      style={styles.itemCardImage}
                    />
                  }
                  backgroundFocusColor={
                    itemIndex === index
                      ? COLORS.GREEN_43F656
                      : COLORS.WHITE_FBF8CC
                  }
                  backgroundColor={COLORS.YELLOW_F2B559}
                  borderWidth={4}
                  isFocus={true}
                  size={scale(90)}
                />
                <ImageBackground
                  source={diamondImages[index % diamondImages.length]}
                  style={styles.imageBackground}>
                  <Text
                    style={[
                      styles.diamondText,
                      {color: isSecondRow ? COLORS.WHITE : COLORS.BLUE_1C6349},
                    ]}>
                    X{item?.diamond}
                  </Text>
                  <Text
                    style={[
                      styles.diamondTextSmall,
                      {color: isSecondRow ? COLORS.WHITE : COLORS.BLUE_1C6349},
                    ]}>
                    Diamonds
                  </Text>
                </ImageBackground>
                <Text style={styles.priceText}>
                  {item.price}
                  {item.currency}
                </Text>
              </View>
            );
          }}
        />
      </View>

      <PrimaryButton
        text="Checkout"
        style={{marginVertical: verticalScale(20), borderRadius: scale(100)}}
        onPress={() => {
          onBuyDiamond(iapState.products?.[itemIndex]);
        }}
        disable={!iapState.products || !iapState.products?.length}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapDiamondPurchaseContainer: {
    marginTop: 16,
    backgroundColor: COLORS.WHITE_FBF8CC,
    borderRadius: 32,
  },
  diamondPurchaseContainer: {
    backgroundColor: COLORS.BLUE_78C5B4,
    borderRadius: 32,
    padding: 16,
  },
  purchaseHeaderTitle: {
    fontSize: 16,
    color: COLORS.WHITE_FBF8CC,
    fontFamily: TYPOGRAPHY.FAMILY.SVNNeuzeitBold,
  },
  wrapDiamondPurchaseContentContainer: {
    padding: 16,
  },
  columnWrapperStyle: {
    justifyContent: 'space-between',
  },
  touchableOpacity: {
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemCardImage: {
    height: '90%',
    width: '90%',
    marginRight: scale(12),
  },
  imageBackground: {
    height: 41,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    bottom: 24,
  },
  diamondText: {
    fontFamily: TYPOGRAPHY.FAMILY.SVNCherishMoment,
    fontSize: 12,
  },
  diamondTextSmall: {
    fontFamily: TYPOGRAPHY.FAMILY.SVNCherishMoment,
    fontSize: 8,
  },
  priceText: {
    fontFamily: TYPOGRAPHY.FAMILY.SVNNeuzeitRegular,
    fontSize: 15,
    color: COLORS.BLUE_258F78,
    marginTop: 4,
  },
});

export default DiamondContainer;
