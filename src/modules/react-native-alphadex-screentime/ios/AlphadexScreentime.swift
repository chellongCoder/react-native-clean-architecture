import ManagedSettings
import WidgetKit
import FamilyControls
import DeviceActivity
import Foundation
import React
import ActivityKit


struct screentimewidgetAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var emoji: String
    }

    // Fixed non-changing properties about your activity go here!
    var name: String
}
@objc(AlphadexScreentime)
class AlphadexScreentime: RCTEventEmitter {
  static var userDefaultsKey = "ScreenTimeSelection"
  @objc(multiply:withB:withResolver:withRejecter:)
  func multiply(a: Float, b: Float, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
    resolve(a*b)
  }
}

@available(iOS 16.0, *)
@objc(ScreenTimeSelectAppsModel)
class ScreenTimeSelectAppsModel: RCTEventEmitter, ObservableObject {
  @objc var onChangeBlock: RCTBubblingEventBlock?

  static let shared = ScreenTimeSelectAppsModel()
  let center = AuthorizationCenter.shared
  private let decoder = JSONDecoder()
  private let encoder = JSONEncoder()
  public static var emitter: RCTEventEmitter!

  let store = ManagedSettingsStore(named: .mySettingStore)

  @objc override public static func requiresMainQueueSetup() -> Bool {
      return false
  }

  override init() {
    super.init()
    EventEmitter.sharedInstance.registerEventEmitter(eventEmitter: self)
  }

  /// Base overide for RCTEventEmitter.
    ///
    /// - Returns: all supported events
  @objc open override func supportedEvents() -> [String] {
      return EventEmitter.sharedInstance.allEvents
  }

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
                    if #available(iOS 16.2, *) {
                      do {
                        let activity = try Activity.request(
                            attributes: screentimewidgetAttributes(name: "ABeeCi"),
                            content: .init(state: screentimewidgetAttributes.ContentState(emoji: "12/20"), staleDate: nil),
                            pushType: .token
                        )
                      } catch {
                          //handle error
                          print(error)
                      }
                    }
                    if #available(iOS 14.0, *) {
                      WidgetCenter.shared.reloadAllTimelines()
                    }
      }
    }
  }

  @objc(sentEvent:withRejecter:)
  func sentEvent(resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
    EventEmitter.sharedInstance.dispatch(name: "Test", body: "Hello")
    resolve(true)
  }


  func sentEvent(event: String) -> Void {
    EventEmitter.sharedInstance.dispatch(name: "Test", body: "Hello")
  }

  func startAppRestrictions() async -> Void {
    let store = ManagedSettingsStore()
    store.application.denyAppRemoval = true
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

        if #available(iOS 16.2, *) {
          do {
            _ = try Activity.request(
                attributes: screentimewidgetAttributes(name: "ABeeCi"),
                content: .init(state: screentimewidgetAttributes.ContentState(emoji: "12/20"), staleDate: nil),
                pushType: .token
            )
          } catch {
              //handle error
              print(error)
          }
        }
        if #available(iOS 14.0, *) {
          WidgetCenter.shared.reloadAllTimelines()
        }
      }
    }
  }

  @objc(unBlockApps:withRejecter:)
  func unBlockApps(resolve:RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock) -> Void {
    let store = ManagedSettingsStore()
    let userDefaults = UserDefaults.init(suiteName: "group.com.hisoft.tbd.app")!
    store.shield.applicationCategories = ShieldSettings.ActivityCategoryPolicy.none
    store.shield.applications = Set()
    userDefaults.set(false, forKey:"blocked")
    // Clear the data for the key "ScreenTimeSelection"
    userDefaults.removeObject(forKey: AlphadexScreentime.userDefaultsKey)
    do {
      let deselectedFamilyActivitySelection = FamilyActivitySelection(includeEntireCategory: true) // adjust this line as needed

        // Save the decoded data back to the UserDefaults
        userDefaults.set(try encoder.encode(deselectedFamilyActivitySelection), forKey: AlphadexScreentime.userDefaultsKey)
    } catch {
        print("Failed to decode or encode data: \(error)")
    }

//    sendEvent("onChangeBlocked", [
//      "isBlocked": false
//    ]);
    Task {
      do {
        if #available(iOS 16.2, *) {
          if let activity = Activity<screentimewidgetAttributes>.activities.first {
            await activity.end(ActivityContent(state: screentimewidgetAttributes.ContentState(emoji: "closing"), staleDate: nil), dismissalPolicy: .immediate)
          }
        }
      } catch {
        reject("Error", "Failed to decode or encode data", error)
      }
    }

    if #available(iOS 14.0, *) {
      WidgetCenter.shared.reloadAllTimelines()
    }

    resolve(true)

  }



}


@available(iOS 16.0, *)
extension ManagedSettingsStore.Name {
    static let mySettingStore = Self("mySettingStore")
}
