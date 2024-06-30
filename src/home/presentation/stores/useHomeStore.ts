import {homeModuleContainer} from 'src/home/HomeModule';
import {HomeStore} from './HomeStore';

const useHomeStore = () => {
  const state = homeModuleContainer.getProvided(HomeStore); // Instantiate CoreService
  return state; // Retrieve CoreStore instance
};

export default useHomeStore;
