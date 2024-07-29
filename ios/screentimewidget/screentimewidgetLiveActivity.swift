//
//  screentimewidgetLiveActivity.swift
//  screentimewidget
//
//  Created by Longnn on 9/6/24.
//

import ActivityKit
import WidgetKit
import SwiftUI
import Intents

struct WorkoutAttributes: ActivityAttributes {

    struct ContentState: Codable,Hashable{
        var status: Status = .stop
        var progress: Float = 0.6
    }
     var workoutName: String

}

// MARK: Workout Status
enum Status : String, CaseIterable, Codable, Equatable{
    case stop = "pause"
    case resume = "play"

    var caption: String{
        switch(self){
            case .stop:
                return "pause"
            case .resume:
                return "play"
        }
    }
}
struct screentimewidgetAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var emoji: String
    }

    // Fixed non-changing properties about your activity go here!
    var name: String
}

struct ProgressBar : View {
    @Binding var progress : Float
    var colors: [Color] = [.red, .blue]

    var body: some View {
        ZStack {
            Circle()
                .stroke(lineWidth: 10.0)
                .opacity(0.20)
                .foregroundColor(Color.gray)

            Circle()
                .trim(from: 0.0, to: CGFloat(min(self.progress, 1.0)))
                .stroke(
                        style: StrokeStyle(lineWidth: 10.0, lineCap: .round, lineJoin: .round))
                .foregroundColor(Color(hex: "#66C270"))
                .rotationEffect(Angle(degrees: -90))
                .animation(.easeInOut(duration: 2.0), value: self.progress)
        }.background(Color.black)
    }
}
struct screentimewidgetLiveActivity: Widget {
    @State private var sliderValue: Double = 0.5

      @ViewBuilder
      func DynamicIslandStatusView(context: ActivityViewContext<screentimewidgetAttributes>)->some View{
          HStack(alignment: .bottom, spacing: 0){
              VStack(alignment: .leading, spacing: 4) {
                  Text("Good job, Fighting!")
                      .font(.callout)
                      .foregroundColor(.white)
                Text(context.state.emoji)
                      .font(.caption2)
                      .foregroundColor(.gray)
              }
              .frame(maxWidth: .infinity,alignment: .leading)
              .offset(x: 5,y: 5)

              HStack(alignment: .bottom,spacing: 0){
                ProgressBar(progress: .constant(0.4))
                      .frame(width: 45, height: 45)
              }


          }
      }
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: screentimewidgetAttributes.self) { context in
            // Lock screen/banner UI goes here
//          HStack {
//              Image("IconSet").resizable().aspectRatio(contentMode: .fit)
//              .frame(width: 50, height: 50)
//              VStack(alignment: .leading) {
//                Text(context.attributes.name)
//                Text(context.state.emoji)
//              }
//              Spacer()
//              VStack(alignment: .trailing) {
//                  Text("Got point")
//                  Text("15/20")
//              }
//          }

          VStack(alignment: .center) {
              VStack(alignment: .center) {
                  HStack {
                      Image("IconSet")
                          .resizable().aspectRatio(contentMode: .fit)
                          .frame(width: 34, height: 34)
                          .foregroundColor(Color(hex: "#66C270"))

                      Spacer()

                    Text("~ Finished: \(context.state.emoji)")
                          .font(.system(size: 14))
                          .bold()
                          .foregroundColor(.white)

                  }
                  .padding(.horizontal, 10)

                  VStack {
                      HStack {
                          Image(systemName: "rectangle.and.pencil.and.ellipsis")
                              .resizable().aspectRatio(contentMode: .fit)
                              .frame(width: 44, height: 44)
                              .foregroundColor(Color(hex: "#66C270"))

                          VStack(spacing: 0) {
                              HStack {
                                  Text("You can do it 💪🏻!")
                                      .font(.system(size: 20))
                                      .bold()
                                      .foregroundColor(.white)

                                  Spacer()
                              }
                          }
                      }
                      .padding(.horizontal, 30)
                  }
              }

              HStack {
                  VStack(alignment: .leading) {
                      Text("Created by")
                          .font(.system(size: 8))
                          .foregroundColor(.white)
                    Text(context.attributes.name)
                          .font(.system(size: 14))
                          .bold()
                          .foregroundColor(.white)
                  }

                  Spacer()

                  VStack(alignment: .trailing) {
                    Image(systemName: "lock.open.iphone")
                        .resizable().aspectRatio(contentMode: .fit)
                        .frame(width: 44, height: 44)
                        .foregroundColor(Color(hex: "#66C270"))
                      Text("Done for unlocking")
                          .font(.system(size: 8))

                  }
              }
              .frame(height: 20)
              .padding(.horizontal, 10)

              HStack {
                  ProgressView(value: CGFloat(("30" as NSString).floatValue), total: 100)
                      .tint(Color(hex: "#66C270"))
                      .background(.white)
              }
              .padding(.horizontal, 10)

          }
          .frame(height: 160)
          .background(.black)



        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI goes here.  Compose the expanded UI through
                // various regions, like leading/trailing/center/bottom
                DynamicIslandExpandedRegion(.leading) {
                  HStack{
                    Image("IconSet")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 40, height: 40)
                        .clipShape(Circle())


                    Text(context.attributes.name)
                          .font(.system(size: 14))
                          .foregroundColor(.white)
                          .frame(maxWidth: .infinity,alignment: .leading)
                  }


                }
                DynamicIslandExpandedRegion(.trailing) {
                  Text("🎯").font(.largeTitle)
                }
                DynamicIslandExpandedRegion(.bottom) {
                    DynamicIslandStatusView(context: context)

                    // more content
                }
              DynamicIslandExpandedRegion(.center) {
                  // more content
//                VStack {
//                      HStack {
//                          Image(systemName: "takeoutbag.and.cup.and.straw.fill")
//                              .resizable().aspectRatio(contentMode: .fit)
//                              .frame(width: 14, height: 14)
//                              .foregroundColor(.yellow)
//                          Spacer()
//                        Text("~ \(context.state.emoji)")
//                              .font(.system(size: 14))
//                              .bold()
//                      }
//                      .padding(.horizontal, 10)
//
//                      VStack {
//                          HStack {
//                              Image(systemName: "figure.outdoor.cycle")
//                                  .resizable().aspectRatio(contentMode: .fit)
//                                  .frame(width: 44, height: 44)
//                                  .foregroundColor(.yellow)
//
//                              VStack(spacing: 0) {
//                                  HStack {
//                                      Text("Your food is on delivery")
//                                          .font(.system(size: 20))
//                                          .bold()
//
//                                      Spacer()
//                                  }
//                                  HStack {
//                                      Button(action: {}, label: {
//                                          HStack {
//                                              Image(systemName: "phone.fill")
//                                                  .resizable().aspectRatio(contentMode: .fit)
//                                                  .frame(width: 14, height: 14)
//                                                  .foregroundColor(.white)
//
//                                              Text("Call")
//                                                  .font(.system(size: 10))
//                                                  .foregroundStyle(.white)
//                                          }
//                                      })
//                                      .buttonBorderShape(.capsule)
//                                      Spacer()
//                                  }
//
//                              }
//                          }.padding(.horizontal, 30)
//                      }
//
//                  }
              }
            } compactLeading: {
              Text("🎯")
            } compactTrailing: {
                Text("\(context.state.emoji)")
            } minimal: {
              Image("IconSet")
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

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
//#Preview("Notification", as: .content, using: screentimewidgetAttributes.preview) {
//   screentimewidgetLiveActivity()
//} contentStates: {
//    screentimewidgetAttributes.ContentState.smiley
//    screentimewidgetAttributes.ContentState.starEyes
//}
