//
//  screentimewidgetLiveActivity.swift
//  screentimewidget
//
//  Created by Longnn on 9/6/24.
//

import ActivityKit
import WidgetKit
import SwiftUI

struct screentimewidgetAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var emoji: String
    }

    // Fixed non-changing properties about your activity go here!
    var name: String
}

struct screentimewidgetLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: screentimewidgetAttributes.self) { context in
            // Lock screen/banner UI goes here
            VStack {
                Text("Being session \(context.state.emoji)")
            }
            .activityBackgroundTint(Color.black)
            .activitySystemActionForegroundColor(Color.white)

        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI goes here.  Compose the expanded UI through
                // various regions, like leading/trailing/center/bottom
                DynamicIslandExpandedRegion(.leading) {
                    Image("IconSet")
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text("🎯")
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text("\(context.state.emoji)")
                    // more content
                }
            } compactLeading: {
              Text("🎯")
            } compactTrailing: {
                Text("\(context.state.emoji)")
            } minimal: {
                Text("🎯")
            }
            .widgetURL(URL(string: "http://www.apple.com"))
            .keylineTint(Color.red)
        }
    }
}

extension screentimewidgetAttributes {
    fileprivate static var preview: screentimewidgetAttributes {
        screentimewidgetAttributes(name: "World")
    }
}

extension screentimewidgetAttributes.ContentState {
    fileprivate static var smiley: screentimewidgetAttributes.ContentState {
        screentimewidgetAttributes.ContentState(emoji: "😀")
     }
     
     fileprivate static var starEyes: screentimewidgetAttributes.ContentState {
         screentimewidgetAttributes.ContentState(emoji: "🤩")
     }
}

//#Preview("Notification", as: .content, using: screentimewidgetAttributes.preview) {
//   screentimewidgetLiveActivity()
//} contentStates: {
//    screentimewidgetAttributes.ContentState.smiley
//    screentimewidgetAttributes.ContentState.starEyes
//}
