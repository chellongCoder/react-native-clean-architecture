export interface LoadingGlobalT {
  show: () => void;
  hide: () => void;
  isShown: boolean;
  toggleLoading: (bool: boolean, nameSpace?: string) => void;
}
