import React, {PropsWithChildren, useCallback, useEffect} from 'react';

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
} from 'react-native-iap';
import {Platform} from 'react-native';
import {observer} from 'mobx-react';
// import {IapStore} from './iapStore';
import useStateCustom from 'src/hooks/useStateCommon';
import {isAndroid} from '../utils';
import {IapContext} from './iapContext';
// import {coreModuleContainer} from 'src/core/CoreModule';

export type TProduct = Product;

export type TIapState = {
  products?: TProduct[];
  isLoading?: boolean;
};

const productSkus = Platform.select({
  android: ['abc_test_1'],
});

export const constants = {
  productSkus,
};

export const IapProvider = observer(({children}: PropsWithChildren) => {
  // const store = coreModuleContainer.getProvided(IapStore);
  const [iapState, setIapState] = useStateCustom<TIapState>({
    products: [],
    isLoading: false,
  });

  // Purchase 1 time products
  const makePurchase = async (sku: Sku) => {
    try {
      const res = await requestPurchase(
        isAndroid
          ? {
              skus: [sku],
            }
          : {
              sku,
              andDangerouslyFinishTransactionAutomaticallyIOS: false,
            },
      );
      if (res) {
        console.log('requestPurchase Success: ', res);
      } else {
        console.log('requestPurchase Failed');
      }
    } catch (error) {
      console.log('Error occurred while makePurchase products', error);
    }
  };

  // init connection to store
  const initializeConnection = useCallback(async () => {
    try {
      await initConnection();
      if (isAndroid) {
        await flushFailedPurchasesCachedAsPendingAndroid();
      }
    } catch (error) {
      console.log('An error occurred', error);
    }
  }, []);

  useEffect(() => {
    initializeConnection();
  }, [initializeConnection]);

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
    fetchProducts();
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
