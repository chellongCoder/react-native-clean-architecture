import ManagedSettings
import FamilyControls
import DeviceActivity
import Foundation

@objc(AlphadexScreentime)
class AlphadexScreentime: NSObject {

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

  @Published var activitySelection: FamilyActivitySelection
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
    let data = userDefaults.data(forKey: "ScreenTimeSelection")
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

  override init() {

    activitySelection = FamilyActivitySelection()
  }
}


@available(iOS 16.0, *)
extension ManagedSettingsStore.Name {
    static let mySettingStore = Self("mySettingStore")
}
