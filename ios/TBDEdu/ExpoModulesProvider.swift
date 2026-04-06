import ExpoModulesCore
import Expo
import ExpoAsset
import EXConstants
import ExpoFileSystem
import ExpoKeepAwake
import ExpoFont
import ExpoHaptics
import ExpoLinking
import ExpoLocalization
import ExpoScreenTime
import ExpoSettings
import ExpoSplashScreen

@objc(ExpoModulesProvider)
public class ExpoModulesProvider: ModulesProvider {
  public override func getModuleClasses() -> [AnyModule.Type] {
    return [
      ExpoFetchModule.self,
      AssetModule.self,
      ConstantsModule.self,
      FileSystemModule.self,
      FileSystemNextModule.self,
      KeepAwakeModule.self,
      FontLoaderModule.self,
      HapticsModule.self,
      ExpoLinkingModule.self,
      LocalizationModule.self,
      ExpoScreenTimeModule.self,
      ExpoSettingsModule.self,
      SplashScreenModule.self,
    ]
  }

  public override func getAppDelegateSubscribers() -> [ExpoAppDelegateSubscriber.Type] {
    return [
      FileSystemBackgroundSessionHandler.self,
      LinkingAppDelegateSubscriber.self,
      SplashScreenAppDelegateSubscriber.self,
    ]
  }

  public override func getReactDelegateHandlers() -> [ExpoReactDelegateHandlerTupleType] {
    return []
  }

  public override func getAppCodeSignEntitlements() -> AppCodeSignEntitlements {
    return AppCodeSignEntitlements.from(json: #"{}"#)
  }
}
