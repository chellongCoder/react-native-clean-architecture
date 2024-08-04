import {createContext} from 'react';
import {OfflineModeT} from '../../@types/OfflineModeT';

export const OfflineContext = createContext<OfflineModeT>({
  isConnected: false,
  storeData: async () => {
    throw new Error('storeData not implemented');
  },
  getData: async () => {
    throw new Error('getData not implemented');
  },
  removeValue: async () => {
    throw new Error('removeValue not implemented');
  },
  clearAll: async () => {
    throw new Error('clearAll not implemented');
  },
});

OfflineContext.displayName = 'OfflineContext';
