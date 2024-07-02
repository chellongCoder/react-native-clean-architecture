import {injectable, provided} from 'inversify-sugar';
import {action, makeAutoObservable} from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'mobx-persist';
import HomeStoreState from './types/HomeStoreState';
import {FieldData} from 'src/home/application/types/GetFieldResponse';
import GetFieldUseCase from 'src/home/application/useCases/GetFieldUseCase';
import GetListSubjectUseCase from 'src/home/application/useCases/GetListSubjectUseCase';
import {GetListSubjectPayload} from 'src/home/application/types/GetListSubjectPayload';
import {Subject} from 'src/home/application/types/GetListSubjectResponse';
import {GetListLessonPayload} from 'src/home/application/types/GetListLessonPayload';
import GetListLessonUseCase from 'src/home/application/useCases/GetListLessonUseCase';
import {Module} from 'src/home/application/types/GetListLessonResponse';

@injectable()
export class HomeStore implements HomeStoreState {
  isLoading = false;
  error = '';
  field: FieldData = {
    _id: '',
    name: '',
    description: '',
    isDeleted: false,
    createdAt: '',
    updatedAt: '',
  };
  listSubject: Subject[] = [];
  listModule: Module[] = [];

  constructor(
    @provided(GetFieldUseCase)
    private getFieldUseCase: GetFieldUseCase,

    @provided(GetListSubjectUseCase)
    private getListSubjectUseCase: GetListSubjectUseCase,

    @provided(GetListLessonUseCase)
    private getListLessonUseCase: GetListLessonUseCase,
  ) {
    this.initializePersistence();
    this.getField = this.getField.bind(this);
  }

  private async initializePersistence() {
    makeAutoObservable(this, {}, {autoBind: true});
  }

  @action
  public setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  @action
  public async getField() {
    this.setIsLoading(true);
    const response = await this.getFieldUseCase.execute();
    this.setIsLoading(false);
    return response;
  }

  @action
  public async getListSubject(fieldId: GetListSubjectPayload) {
    this.setIsLoading(true);
    const response = await this.getListSubjectUseCase.execute({
      fieldId: fieldId.fieldId,
    });
    if (response.data) {
      this.listSubject = response.data;
    }
    this.setIsLoading(false);
    return response;
  }

  @action
  public async getListModules({childrenId, subjectId}: GetListLessonPayload) {
    this.setIsLoading(true);
    const response = await this.getListLessonUseCase.execute({
      childrenId,
      subjectId,
    });

    this.listModule = response.data;
    this.setIsLoading(false);
    return response;
  }
}

export const hydrate = create({
  storage: AsyncStorage, // or AsyncStorage in react-native.
  // default: localStorage
  jsonify: true, // if you use AsyncStorage, here shoud be true
  // default: true
});
