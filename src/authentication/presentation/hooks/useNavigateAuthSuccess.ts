import {useCallback} from 'react';
import {STACK_NAVIGATOR} from 'src/core/presentation/navigation/ConstantNavigator';
import {pushScreen} from 'src/core/presentation/navigation/actions/RootNavigationActions';

const useNavigateAuthSuccess = () => {
  const handleNavigateAuthenticationSuccess = useCallback(async () => {
    pushScreen(STACK_NAVIGATOR.BOTTOM_TAB_SCREENS);
  }, []);

  return {
    handleNavigateAuthenticationSuccess,
  };
};

export default useNavigateAuthSuccess;
