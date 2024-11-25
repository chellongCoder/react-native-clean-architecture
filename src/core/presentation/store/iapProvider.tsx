import React, {PropsWithChildren, useEffect} from 'react';

import {
  initConnection,
  flushFailedPurchasesCachedAsPendingAndroid,
  Sku,
  requestPurchase,
  purchaseUpdatedListener,
  finishTransaction,
  purchaseErrorListener,
  getProducts,
  Product,
  ProductPurchase,
  endConnection,
} from 'react-native-iap';
import {Platform, StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react';
// import {IapStore} from './iapStore';
import useStateCustom from 'src/hooks/useStateCommon';
import {isAndroid} from '../utils';
import {IapContext} from './iapContext';
import {lessonModuleContainer} from 'src/lesson/LessonModule';
import {LessonStore} from 'src/lesson/presentation/stores/LessonStore/LessonStore';
import PurchaseModulePayload from 'src/lesson/application/types/PurchaseModulePayload';
import {generateFullUUID} from 'src/authentication/presentation/constants/common';
import PurchaseSuccessScreen from '../screens/PurchaseSuccessScreen';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
// import {coreModuleContainer} from 'src/core/CoreModule';

export type TProduct = Product;

export type TIapState = {
  products?: TProduct[];
  isLoading?: boolean;
  isPurchaseSuccess?: boolean;
  isShowModal?: boolean;
};

const productSkus = Platform.select({
  android: ['abc_test_1', 'abc_test_2', 'abc_test_3'],
});

export const constants = {
  productSkus,
};

export const IapProvider = observer(({children}: PropsWithChildren) => {
  const store = lessonModuleContainer.getProvided(LessonStore);
  const {handlePurchaseModule} = store;

  const [iapState, setIapState] = useStateCustom<TIapState>({
    products: [],
    isLoading: false,
    isPurchaseSuccess: false,
    isShowModal: false,
  });

  const formatPackageId = (packageId: any): string => {
    // Prepend zeros until the length is 4
    while (packageId.length < 4) {
      packageId = '0' + packageId;
    }
    return packageId;
  };

  const formatUserId = (packageId: any): string => {
    // Prepend zeros until the length is 4
    while (packageId.length < 12) {
      packageId = '0' + packageId;
    }
    return packageId.toString();
  };

  const uuid = generateFullUUID();

  // Purchase 1 time products
  const makePurchase = async (sku: Sku) => {
    const arr = uuid.split('-');
    const appAccountToken = `${arr[0]}-${arr[1]}-${arr[2]}-${formatPackageId(
      sku + '',
    )}-${formatUserId(sku + '')}`;

    try {
      setIapState({isPurchaseSuccess: false});
      const res: ProductPurchase | ProductPurchase[] | void =
        await requestPurchase(
          isAndroid
            ? {
                skus: [sku],
                obfuscatedAccountIdAndroid: appAccountToken,
                obfuscatedProfileIdAndroid: appAccountToken,
                appAccountToken,
              }
            : {
                sku,
                andDangerouslyFinishTransactionAutomaticallyIOS: false,
              },
        );

      if (res) {
        const purchase = Array.isArray(res) ? res[0] : res;
        const params: PurchaseModulePayload = {
          packageName: purchase?.packageNameAndroid || '',
          productId: purchase?.productId || '',
          purchaseToken: purchase?.purchaseToken || '',
          orderId: purchase?.transactionId || '',
        };

        try {
          const purchaseModuleRes = await handlePurchaseModule(params);
          if (purchaseModuleRes) {
            setIapState({isShowModal: true, isPurchaseSuccess: true});
          } else {
            setIapState({isShowModal: true, isPurchaseSuccess: false});
          }
        } catch (error) {
          console.log('Error occurred while verify purchase', error);
        }
      } else {
        console.log('requestPurchase Failed');
      }
    } catch (error) {
      console.log('Error occurred while makePurchase products', error);
    }
  };

  const fetchProducts = async () => {
    setIapState({isLoading: true});
    try {
      const result = await getProducts({skus: constants.productSkus || []});
      console.log('getProducts result: ', result);
      if (result) {
        setIapState({products: result, isLoading: false});
      }
    } catch (error) {
      setIapState({isLoading: false});
      console.log('Cannot get list product: ', error);
    }
  };

  useEffect(() => {
    const initializeConnection = async () => {
      try {
        await initConnection();
        if (Platform.OS === 'android') {
          await flushFailedPurchasesCachedAsPendingAndroid();
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('An error occurred', error.message);
        } else {
          console.error('An unknown error occurred', error);
        }
      }
    };

    const purchaseUpdate = purchaseUpdatedListener(async purchase => {
      const receipt = purchase.transactionReceipt;

      if (receipt) {
        try {
          await finishTransaction({purchase, isConsumable: true});
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error('An error occurred', error.message);
          } else {
            console.error('An unknown error occurred', error);
          }
        }
      }
    });

    const purchaseError = purchaseErrorListener(error =>
      console.error('Purchase error', error.message),
    );

    initializeConnection();
    fetchProducts();

    return () => {
      endConnection();
      purchaseUpdate.remove();
      purchaseError.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IapContext.Provider
      value={{
        iapState,
        makePurchase,
      }}>
      {children}
      {iapState.isShowModal ? (
        <View style={styles.absoluteContent}>
          <PurchaseSuccessScreen
            isSuccess={iapState.isPurchaseSuccess ?? false}
            setIapState={setIapState}
          />
        </View>
      ) : null}
    </IapContext.Provider>
  );
});

const styles = StyleSheet.create({
  absoluteContent: {
    position: 'absolute',
    zIndex: 999,
    width: '100%',
    height: '100%',
  },
});
