//
//  EventEmitter.swift
//  react-native-alphadex-screentime
//
//  Created by Longnn on 29/5/24.
//

import Foundation
@available(iOS 16.0, *)
class EventEmitter {

    /// Shared Instance.
    public static var sharedInstance = EventEmitter()

    // ReactNativeEventEmitter is instantiated by React Native with the bridge.
    private static var eventEmitter: ScreenTimeSelectAppsModel!

    private init() {}

    // When React Native instantiates the emitter it is registered here.
    func registerEventEmitter(eventEmitter: ScreenTimeSelectAppsModel) {
        EventEmitter.eventEmitter = eventEmitter
    }

    func dispatch(name: String, body: Any?) {
      EventEmitter.eventEmitter.sendEvent(withName: name, body: body)
    }

    /// All Events which must be support by React Native.
    lazy var allEvents: [String] = {
        var allEventNames: [String] = ["BlockApps", "FFmpegKitCompleteCallbackEvent", "FFmpegKitLogCallbackEvent"]

        // Append all events here

        return allEventNames
    }()

}
