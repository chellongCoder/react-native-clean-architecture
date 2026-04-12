import {useCallback, useEffect, useState} from 'react';
import {Module} from 'src/home/application/types/GetListLessonResponse';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';
import useAuthenStore from 'src/authentication/presentation/hooks/useAuthenStore';
import {useI18n} from 'src/core/presentation/hooks/useI18n';
import {useLessonStore} from '../stores/LessonStore/useGetPostsStore';
import {UserModule} from 'src/lesson/application/types/GetUserModuleResponse';
import useGetUserProfile from './useGetUserProfile';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';

interface UseGetModulesBySubjectParams {
  subjectId: string;
}

const useGetModulesBySubject = ({subjectId}: UseGetModulesBySubjectParams) => {
  const homeStore = useHomeStore();
  const authStore = useAuthenStore();
  const lessonStore = useLessonStore();
  const i18n = useI18n();
  const {handleGetUserProfile} = useGetUserProfile();
  const {userProfile} = useAuthenticationStore();

  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userModule, setUserModule] = useState<UserModule[]>([]);
  const [loadingModuleId, setLoadingModuleId] = useState<string | null>(null);
  const [purchaseState, setPurchaseState] = useState<{
    isShowModal?: boolean;
    isPurchaseSuccess?: boolean;
  }>({
    isShowModal: false,
    isPurchaseSuccess: false,
  });

  const fetchModules = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await homeStore.getListModules({
        subjectId,
        childrenId: authStore.selectedChild?._id ?? '',
      });

      const listTitle = response.data.map(item => item.description);
      const listDesc = response.data.map(
        item => item.tasks?.map(task => task.description).toString() ?? '',
      );

      try {
        const [resTitle, resDesc] = await Promise.all([
          lessonStore.translateText({
            text: listTitle,
            targetLanguage: i18n.deviceLocale,
          }),
          lessonStore.translateText({
            text: listDesc,
            targetLanguage: i18n.deviceLocale,
          }),
        ]);

        const translatedModules = response.data.map((item, index) => ({
          ...item,
          name: resTitle.data[index],
          description: resTitle.data[index],
          tasks: item.tasks?.map((task, i) => ({
            ...task,
            description: (resDesc.data[index] ?? '').split(',')[i],
          })),
        }));
        setModules(translatedModules);
      } catch {
        setModules(response.data);
      }
    } catch (error) {
      console.log('useGetModulesBySubject fetchModules error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [
    homeStore,
    subjectId,
    authStore.selectedChild?._id,
    lessonStore,
    i18n.deviceLocale,
  ]);

  const fetchUserModules = useCallback(
    async (currentModules: Module[]) => {
      try {
        const res = await lessonStore.handleGetUserModule(currentModules);
        setUserModule(res);
      } catch (error) {
        console.log('useGetModulesBySubject fetchUserModules error:', error);
      }
    },
    [lessonStore],
  );

  const onBuyModule = async (item: Module) => {
    try {
      setLoadingModuleId(item._id);
      const res = await lessonStore.handleBuyUserModule({
        lessonId: item._id,
      });
      if (res) {
        handleGetUserProfile();
        setPurchaseState({
          isShowModal: true,
          isPurchaseSuccess: true,
        });
      }
    } catch {
      setPurchaseState({
        isShowModal: true,
        isPurchaseSuccess: false,
      });
    } finally {
      setLoadingModuleId(null);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  useEffect(() => {
    fetchUserModules(modules);
  }, [fetchUserModules, modules, purchaseState.isPurchaseSuccess]);

  return {
    modules,
    isLoading,
    userModule,
    loadingModuleId,
    purchaseState,
    setPurchaseState,
    onBuyModule,
    userProfile,
  };
};

export default useGetModulesBySubject;
