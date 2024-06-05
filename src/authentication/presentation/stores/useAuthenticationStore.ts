import {authenticationModuleContainer} from 'src/authentication/AuthenticationModule';
import {AuthenticationStore} from 'src/authentication/presentation/stores/AuthenticationStore';

const useAuthenticationStore = () => {
  const state = authenticationModuleContainer.getProvided(AuthenticationStore); // Instantiate CoreService
  return state; // Retrieve CoreStore instance
};

export default useAuthenticationStore;
