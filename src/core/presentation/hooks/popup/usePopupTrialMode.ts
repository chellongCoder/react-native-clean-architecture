import {useContextStore} from '../useContextStore';
import {PopupModalContext} from './PopupModalGlobalProvider';

export const usePopupTrialMode = () => {
  const store = useContextStore(PopupModalContext);

  return store;
};
