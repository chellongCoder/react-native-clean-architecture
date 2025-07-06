import {injectable, provided} from 'inversify-sugar';
import {action, computed, makeAutoObservable, observable} from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {create, persist} from 'mobx-persist';
import HomeStoreState, {ModuleItemProps} from './types/HomeStoreState';
import {FieldData} from 'src/home/application/types/GetFieldResponse';
import GetFieldUseCase from 'src/home/application/useCases/GetFieldUseCase';
import GetListSubjectUseCase from 'src/home/application/useCases/GetListSubjectUseCase';
import {GetListSubjectPayload} from 'src/home/application/types/GetListSubjectPayload';
import {
  Subject,
  TypeSubject,
} from 'src/home/application/types/GetListSubjectResponse';
import {GetListLessonPayload} from 'src/home/application/types/GetListLessonPayload';
import GetListLessonUseCase from 'src/home/application/useCases/GetListLessonUseCase';
import {Module} from 'src/home/application/types/GetListLessonResponse';
import GetListQuestionUseCase from 'src/home/application/useCases/GetListQuestionUseCase';
import {LessonSettingT} from 'src/home/application/types/GetListQuestionResponse';
import LoggingActionUseCase from 'src/home/application/useCases/LoggingActionUseCase';
import {LoggingActionPayload} from 'src/home/application/types/LoggingActionPayload';
import GetUserProfileResponse from 'src/authentication/application/types/GetUserProfileResponse';
import {StyleProp, ViewStyle} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';

@injectable()
export class HomeStore implements HomeStoreState {
  isLoading = false;
  error = '';
  @persist('object') @observable field: FieldData = {
    _id: '',
    name: '',
    description: '',
    isDeleted: false,
    createdAt: '',
    updatedAt: '',
  };
  @persist('list') @observable listSubject: Subject[] = [];
  @persist('list') @observable listModule: Module[] = [];
  @persist subjectId = '';
  @persist showTutorial = true;
  moduleItem?: ModuleItemProps;

  @observable lessonSetting?: LessonSettingT;

  characterStyle: StyleProp<ViewStyle> = {
    height: verticalScale(170),
    marginBottom: -verticalScale(40),
    marginLeft: -scale(20),
  };

  constructor(
    @provided(GetFieldUseCase)
    private getFieldUseCase: GetFieldUseCase,

    @provided(GetListSubjectUseCase)
    private getListSubjectUseCase: GetListSubjectUseCase,

    @provided(GetListLessonUseCase)
    private getListLessonUseCase: GetListLessonUseCase,

    @provided(GetListQuestionUseCase)
    private getListQuestionUseCase: GetListQuestionUseCase,

    @provided(LoggingActionUseCase)
    private loggingActionUseCase: LoggingActionUseCase,
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
  public async setSubjectId(index: string) {
    this.subjectId = index;
  }

  @action
  public async setShowTutorial(showTutorial: boolean) {
    this.showTutorial = showTutorial;
  }

  @computed
  public get rootSubject() {
    const s = this.listSubject.find(e => e._id === this.subjectId);
    const roots = this.listSubject.filter(e => e.type === TypeSubject.ROOT);
    if (s?.parentId) {
      return roots.find(e => e._id === s.parentId);
    } else {
      return s;
    }
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
    this.listModule = [];
    this.setIsLoading(true);
    const response = await this.getListLessonUseCase.execute({
      childrenId,
      subjectId,
    });

    this.listModule = response.data;
    this.setIsLoading(false);
    return response;
  }

  @action
  public async getListQuestions({subjectId}: Partial<GetListLessonPayload>) {
    this.setIsLoading(true);
    const response = await this.getListQuestionUseCase.execute({
      subjectId,
    });
    this.lessonSetting = response.data.lessonSetting;
    this.setIsLoading(false);
    return response;
  }

  @action
  public async putLoggingAction(log: LoggingActionPayload) {
    const response = await this.loggingActionUseCase.execute(log);
    return response;
  }

  @action
  public checkDoingModule(
    userProfile?: GetUserProfileResponse['data'],
    moduleItem?: ModuleItemProps,
  ) {
    if (userProfile?.isTrial) {
      this.moduleItem = moduleItem;
      return 'being_trial';
    } else {
      if (!userProfile?.startFreeTrial || !userProfile?.endFreeTrial) {
        this.moduleItem = moduleItem;
        return 'no_trial';
      } else if (new Date() > new Date(userProfile?.endFreeTrial)) {
        return 'end_trial';
      }
    }
  }
}

export const hydrate = create({
  storage: AsyncStorage, // or AsyncStorage in react-native.
  // default: localStorage
  jsonify: true, // if you use AsyncStorage, here shoud be true
  // default: true
});
