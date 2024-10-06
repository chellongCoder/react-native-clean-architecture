import {injectable} from 'inversify-sugar';
import {action} from 'mobx';
import IapStoreState from './types/iapStoreState';

@injectable()
export class IapStore implements IapStoreState {
  isInit = false;

  constructor() {
    this.isInit = false;
  }

  @action
  public setIsInitSuccess() {
    this.isInit = true;
  }
}
