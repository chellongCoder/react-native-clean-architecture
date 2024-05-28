import ManagedSettings
import FamilyControls
import DeviceActivity
import Foundation

@objc(AlphadexScreentime)
class AlphadexScreentime: NSObject {
  static var userDefaultsKey = "ScreenTimeSelection"
  @objc(multiply:withB:withResolver:withRejecter:)
  func multiply(a: Float, b: Float, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
    resolve(a*b)
  }
}

@available(iOS 16.0, *)
@objc(ScreenTimeSelectAppsModel)
class ScreenTimeSelectAppsModel: NSObject, ObservableObject {
  static let shared = ScreenTimeSelectAppsModel()
  let center = AuthorizationCenter.shared
  private let decoder = JSONDecoder()
  private let encoder = JSONEncoder()

  let store = ManagedSettingsStore(named: .mySettingStore)

  @Published var activitySelection = FamilyActivitySelection(includeEntireCategory: true)
  @Published var selectionToDiscourage = FamilyActivitySelection() {
      willSet {
        let applications = newValue.applicationTokens
        let categories = newValue.categoryTokens
        let webCategories = newValue.webDomainTokens
        store.shield.applications = applications.isEmpty ? nil : applications
        store.shield.applicationCategories = ShieldSettings.ActivityCategoryPolicy.specific(categories, except: Set())
        store.shield.webDomains = webCategories
       }
    }

  @objc(multiply:withB:withResolver:withRejecter:)
  func multiply(a: Float, b: Float, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
    resolve(a*b)
  }

  @objc(requestScreenTime:withRejecter:)
  func requestScreenTime(resolve:RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock) -> Void {
    Task {
      do {
        try await self.center.requestAuthorization(for: .individual)
      } catch {
        reject("Error", "Failed to decode or encode data", error)
      }
    }
    resolve(true)
  }

  @objc(selectedAppsData:withRejecter:)
  func selectedAppsData(resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
    let userDefaults = UserDefaults.init(suiteName: "group.com.hisoft.tbd.app")!
    let data = userDefaults.data(forKey: AlphadexScreentime.userDefaultsKey)
    if let data = data {
        do {
            let decodedData = try decoder.decode(FamilyActivitySelection.self, from: data)
            let jsonData = try encoder.encode(decodedData)
            let json = String(data: jsonData, encoding: String.Encoding.utf8)
            resolve(json)
        } catch {
            reject("Error", "Failed to decode or encode data", error)
        }
    }
  }

  @objc(blockApps:withRejecter:)
  func blockApps(resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
    let store = ManagedSettingsStore()
    let userDefaults = UserDefaults.init(suiteName: "group.com.hisoft.tbd.app")!
    let data = userDefaults.data(forKey: AlphadexScreentime.userDefaultsKey)
    if data != nil {
      let decodedData = try? decoder.decode(
        FamilyActivitySelection.self,
        from: data!
      )
      if let unwrapped = decodedData {
        store.shield.applicationCategories = ShieldSettings.ActivityCategoryPolicy.specific(unwrapped.categoryTokens)
        store.shield.applications = unwrapped.applicationTokens
        userDefaults.set(true, forKey:"blocked")
        //            sendEvent("onChangeBlocked", [
        //              "isBlocked": true
        //            ]);
        //            if #available(iOS 16.2, *) {
        //                let activity = try Activity.request(
        //                    attributes: screentimewidgetAttributes(name: "Text1"),
        //                    content: .init(state: screentimewidgetAttributes.ContentState(emoji: "Blocked"), staleDate: nil),
        //                    pushType: .token
        //                )
        //            }
        //            if #available(iOS 14.0, *) {
        //              WidgetCenter.shared.reloadAllTimelines()
        //            }
      }
    }
  }

  func startAppRestrictions() -> Void {
    let store = ManagedSettingsStore()
    let userDefaults = UserDefaults.init(suiteName: "group.com.hisoft.tbd.app")!
    let data = userDefaults.data(forKey: AlphadexScreentime.userDefaultsKey)
    if data != nil {
      let decodedData = try? decoder.decode(
        FamilyActivitySelection.self,
        from: data!
      )
      if let unwrapped = decodedData {
        store.shield.applicationCategories = ShieldSettings.ActivityCategoryPolicy.specific(unwrapped.categoryTokens)
        store.shield.applications = unwrapped.applicationTokens
        userDefaults.set(true, forKey:"blocked")
        //            sendEvent("onChangeBlocked", [
        //              "isBlocked": true
        //            ]);
        //            if #available(iOS 16.2, *) {
        //                let activity = try Activity.request(
        //                    attributes: screentimewidgetAttributes(name: "Text1"),
        //                    content: .init(state: screentimewidgetAttributes.ContentState(emoji: "Blocked"), staleDate: nil),
        //                    pushType: .token
        //                )
        //            }
        //            if #available(iOS 14.0, *) {
        //              WidgetCenter.shared.reloadAllTimelines()
        //            }
      }
    }
  }

  @objc(unBlockApps:withRejecter:)
  func unBlockApps(resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
    let store = ManagedSettingsStore()
    let userDefaults = UserDefaults.init(suiteName: "group.com.hisoft.tbd.app")!
    store.shield.applicationCategories = ShieldSettings.ActivityCategoryPolicy.none
    store.shield.applications = Set()
    userDefaults.set(false, forKey:"blocked")
    resolve(true)
//    sendEvent("onChangeBlocked", [
//      "isBlocked": false
//    ]);
//      if #available(iOS 16.2, *) {
//        if let activity = Activity<screentimewidgetAttributes>.activities.first {
//          await activity.end(ActivityContent(state: screentimewidgetAttributes.ContentState(emoji: "closing"), staleDate: nil), dismissalPolicy: .immediate)
//        }
//      }
//    if #available(iOS 14.0, *) {
//      WidgetCenter.shared.reloadAllTimelines()
//    }
  }



  override init() {
  }
}


@available(iOS 16.0, *)
extension ManagedSettingsStore.Name {
    static let mySettingStore = Self("mySettingStore")
}
