import {AuthenticationStore} from '../stores/AuthenticationStore';
import {authenticationModuleContainer} from 'src/authentication/AuthenticationModule';

const useAuthenStore = () => {
  const state = authenticationModuleContainer.getProvided(AuthenticationStore); // Instantiate CoreService
  return state; // Retrieve CoreStore instance
};

export default useAuthenStore;
