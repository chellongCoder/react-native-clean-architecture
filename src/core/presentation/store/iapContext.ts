import {createContext} from 'react';
import {IapContextType} from './types/iapContextType';

export const IapContext = createContext<IapContextType>({
  iapState: {products: []},
  subscribe: () => {
    /* Add subscription logic here */
  },
  unsubscribe: () => {
    /* Add un-subscription logic here */
  },
  makePurchase: () => {
    /* Add makePurchase logic here */
  },
  getListProduct: () => {
    /* Add makePurchase logic here */
  },
});

IapContext.displayName = 'IapContext';
