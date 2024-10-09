import {injectable} from 'inversify-sugar';
import {action, makeAutoObservable, observable} from 'mobx';
import {create} from 'mobx-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

@injectable()
export class SpeechToTextStore {
  @observable text = '';

  constructor() {
    makeAutoObservable(this);
  }

  @action
  setText = (e: string) => {
    this.text = e;
  };
}

export const hydrate = create({
  storage: AsyncStorage, // or AsyncStorage in react-native.
  // default: localStorage
  jsonify: true, // if you use AsyncStorage, here shoud be true
  // default: true
});
