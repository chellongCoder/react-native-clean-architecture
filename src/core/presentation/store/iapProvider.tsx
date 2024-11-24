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
} from 'react-native-iap';
import {Platform} from 'react-native';
import {observer} from 'mobx-react';
// import {IapStore} from './iapStore';
import useStateCustom from 'src/hooks/useStateCommon';
import {isAndroid} from '../utils';
import {IapContext} from './iapContext';
import {lessonModuleContainer} from 'src/lesson/LessonModule';
import {LessonStore} from 'src/lesson/presentation/stores/LessonStore/LessonStore';
import PurchaseModulePayload from 'src/lesson/application/types/PurchaseModulePayload';
import {generateFullUUID} from 'src/authentication/presentation/constants/common';
// import {coreModuleContainer} from 'src/core/CoreModule';

export type TProduct = Product;

export type TIapState = {
  products?: TProduct[];
  isLoading?: boolean;
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
    console.log('appAccountToken: ', appAccountToken);
    try {
      const res: ProductPurchase = await requestPurchase(
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
      console.log('res: ', res);
      if (res) {
        const params: PurchaseModulePayload = {
          packageName: res.productId,
          productId: res.productId,
          purchaseToken: res.purchaseToken || '',
        };

        try {
          const purchaseModuleRes = await handlePurchaseModule(params);
          console.log('purchaseModuleRes: ', purchaseModuleRes);
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

  // get list product
  useEffect(() => {
    const purchaseUpdateSubscription = purchaseUpdatedListener(
      async purchase => {
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          try {
            await finishTransaction({purchase, isConsumable: false});
          } catch (error) {
            console.error(
              'An error occurred while completing transaction',
              error,
            );
          }
        }
      },
    );
    const purchaseErrorSubscription = purchaseErrorListener(error =>
      console.error('Purchase error', error.message),
    );
    const fetchProducts = async () => {
      setIapState({isLoading: true});
      try {
        const result = await getProducts({skus: constants.productSkus || []});
        if (result) {
          setIapState({products: result, isLoading: false});
        }
      } catch (error) {
        setIapState({isLoading: false});
        console.log('Cannot get list product: ', error);
      }
    };
    const initializeProducts = async () => {
      const res = await initConnection();
      if (res) {
        if (isAndroid) {
          await flushFailedPurchasesCachedAsPendingAndroid();
        }
        await fetchProducts(); // Ensure fetchProducts is awaited
      }
    };
    initializeProducts();
    return () => {
      purchaseUpdateSubscription.remove();
      purchaseErrorSubscription.remove();
    };
  }, [setIapState]);

  return (
    <IapContext.Provider
      value={{
        iapState,
        makePurchase,
      }}>
      {children}
    </IapContext.Provider>
  );
});
