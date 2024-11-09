import {useCallback} from 'react';
import {STACK_NAVIGATOR} from 'src/core/presentation/navigation/ConstantNavigator';
import {replaceScreen} from 'src/core/presentation/navigation/actions/RootNavigationActions';

const useNavigateAuth = () => {
  const handleNavigateAuthenticationSuccess = useCallback(async () => {
    replaceScreen(STACK_NAVIGATOR.AUTH.LIST_CHILDREN_SCREEN, {});
  }, []);

  const handleNavigateAuthenticationFail = useCallback(async () => {
    replaceScreen(STACK_NAVIGATOR.AUTH.LOGIN_SCREEN, {});
  }, []);
  return {
    handleNavigateAuthenticationSuccess,
    handleNavigateAuthenticationFail,
  };
};

export default useNavigateAuth;
