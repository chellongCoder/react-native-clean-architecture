import {injectable, provided} from 'inversify-sugar';
import {action, makeAutoObservable} from 'mobx';

@injectable()
export class LessonStore {
  point: {value: number; isShow: boolean} = {value: 0, isShow: false};

  constructor() {
    makeAutoObservable(this);
  }

  @action
  setIsShow = (bool: boolean) => {
    this.point.isShow = bool;
  };

  @action
  setPoint = (score: number) => {
    this.point.value = score;
  };
}
