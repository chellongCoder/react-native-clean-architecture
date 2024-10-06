import {Sku} from 'react-native-iap';
import {IapStore} from '../iapStore';
import {TIapState} from '../iapProvider';

export interface IapContextType {
  iapStore?: IapStore;
  // Add more custom values as needed
  iapState: TIapState;
  subscribe?: (sku: Sku, packageId: number, offerToken?: string) => void;
  makePurchase?: (sku: Sku) => void;
  unsubscribe?: (sku: Sku, packageId: number, fee: number) => void;
  getListProduct?: () => void;
}
