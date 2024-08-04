export interface OfflineModeT {
  isConnected: boolean | null;
  storeData: (key: string, value: any) => Promise<void>;
  getData: (key: string) => Promise<any | null>;
  removeValue: (key: string) => Promise<void>;
  clearAll: () => Promise<void>;
}
