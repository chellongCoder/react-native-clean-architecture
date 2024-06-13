//
//  screentimewidget.swift
//  screentimewidget
//
//  Created by Longnn on 9/6/24.
//

import WidgetKit
import SwiftUI
import AppIntents
import FamilyControls
import ManagedSettings

struct Provider: AppIntentTimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
      SimpleEntry(date: Date(), blocked: false, configuration: ConfigurationAppIntent())
    }

    func snapshot(for configuration: ConfigurationAppIntent, in context: Context) async -> SimpleEntry {
      SimpleEntry(date: Date(), blocked: false, configuration: configuration)
    }
    
    func timeline(for configuration: ConfigurationAppIntent, in context: Context) async -> Timeline<SimpleEntry> {

        // Generate a timeline consisting of five entries an hour apart, starting from the current date.
      let userDefaults = UserDefaults.init(suiteName: "group.com.hisoft.tbd.app")
      let entryDate = Date()
      if let unwrappedUD = userDefaults {
        let isBlocked = unwrappedUD.bool(forKey: "blocked")
        let nextRefresh = Calendar.current.date(byAdding: .minute, value: 5, to: entryDate)!
        let entry = SimpleEntry(date: nextRefresh, blocked: isBlocked, configuration: configuration)
        return Timeline(entries: [entry], policy: .atEnd)
      }
      let nextRefresh = Calendar.current.date(byAdding: .minute, value: 5, to: entryDate)!
      let entry = SimpleEntry(date: nextRefresh, blocked: false, configuration: configuration)
      return Timeline(entries: [entry], policy: .atEnd)
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let blocked: Bool
    let configuration: ConfigurationAppIntent
}

struct screentimewidgetEntryView : View {
  var entry: Provider.Entry

  var body: some View {
      VStack {
          Text(entry.blocked ? "Blocked" : "Unblocked")

          if #available(iOS 17.0, *) {
              HStack(alignment: .top) {
                  Button(intent: BlockUnblock()) {
                    Image(systemName: "bolt.fill")
                  }
              }
              .tint(entry.blocked ? .purple : .gray)
              .padding()
          }
      }
  }
}

@available(iOS 16.0, macOS 13.0, watchOS 9.0, tvOS 16.0, *)
struct BlockUnblock: AppIntent {
  private let decoder = JSONDecoder()
  private let encoder = JSONEncoder()
    static var title: LocalizedStringResource = "Block Unblock Intent"
    static var description = IntentDescription("Changes block/unblock state.")

  func isBlocked() -> Bool {
    let userDefaults = UserDefaults.init(suiteName: "group.com.hisoft.tbd.app")!
    return userDefaults.bool(forKey: "blocked")
  }

  func blockApps() {
    if #available(iOS 16.0, *) {
      let store = ManagedSettingsStore()
      let userDefaults = UserDefaults.init(suiteName: "group.com.hisoft.tbd.app")!
      let data = userDefaults.data(forKey: "ScreenTimeSelection")
      if data != nil {
        let decodedData = try? decoder.decode(
            FamilyActivitySelection.self,
            from: data!
        )
          if let unwrapped = decodedData {
              store.shield.applicationCategories = ShieldSettings.ActivityCategoryPolicy.specific(unwrapped.categoryTokens)
              store.shield.applications = unwrapped.applicationTokens
              userDefaults.set(true, forKey:"blocked")
//              sendEvent("onChangeBlocked", [
//                "isBlocked": true
//              ]);
              if #available(iOS 14.0, *) {
                WidgetCenter.shared.reloadAllTimelines()
              }
          }
      }
    }
  }

  func unblockApps() {
    if #available(iOS 16.0, *) {
      let store = ManagedSettingsStore()
      let userDefaults = UserDefaults.init(suiteName: "group.com.hisoft.tbd.app")!
      store.shield.applicationCategories = ShieldSettings.ActivityCategoryPolicy.none
      store.shield.applications = Set()
      userDefaults.set(false, forKey:"blocked")
//      sendEvent("onChangeBlocked", [
//        "isBlocked": false
//      ]);
      if #available(iOS 14.0, *) {
        WidgetCenter.shared.reloadAllTimelines()
      }
    }
  }

    func perform() async throws -> some IntentResult {
        let blocked = isBlocked()
        if blocked {
          unblockApps()

        } else {
          blockApps()
        }
//        NotificationCenter.default.post(name: Notification.Name("WidgetChangeNotification"), object: nil)
        return .result()
    }
}


struct screentimewidget: Widget {
  let kind: String = "screentimewidget"

  var body: some WidgetConfiguration {
      AppIntentConfiguration(kind: kind, intent: ConfigurationAppIntent.self, provider: Provider()) { entry in
          screentimewidgetEntryView(entry: entry)
              .containerBackground(.fill.tertiary, for: .widget)
      }
      .supportedFamilies([.systemSmall])
  }
}

extension ConfigurationAppIntent {
    fileprivate static var smiley: ConfigurationAppIntent {
        let intent = ConfigurationAppIntent()
        intent.favoriteEmoji = "😀"
        return intent
    }
    
    fileprivate static var starEyes: ConfigurationAppIntent {
        let intent = ConfigurationAppIntent()
        intent.favoriteEmoji = "🤩"
        return intent
    }
}

//#Preview(as: .systemSmall) {
//    screentimewidget()
//} timeline: {
//    SimpleEntry(date: .now, configuration: .smiley)
//    SimpleEntry(date: .now, configuration: .starEyes)
//}
