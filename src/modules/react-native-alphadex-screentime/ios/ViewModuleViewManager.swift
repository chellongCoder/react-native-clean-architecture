import UIKit
import CoreMotion
import SwiftUI
import FamilyControls
import Combine

@available(iOS 16.0, *)
@objc(ViewModuleViewManager)
class ViewModuleViewManager: RCTViewManager {

  override func view() -> (ViewModuleView) {

    return ViewModuleView()
  }

  @objc override static func requiresMainQueueSetup() -> Bool {
    return false
  }
}

@available(iOS 16.0, *)
class ViewModuleView : UIView {
  @objc var onChangeBlock: RCTDirectEventBlock? = nil
  @objc var childrenId: String? = nil
  private var cancellables = Set<AnyCancellable>()
  private let userDefaultsKey = AlphadexScreentime.userDefaultsKey
  private let encoder = JSONEncoder()
  private let decoder = JSONDecoder()

  @objc var color: String = "" {
    didSet {
    }
  }

  var view: UIView?

  func saveSelection(selection: FamilyActivitySelection) {
    let defaults = UserDefaults.init(suiteName: childrenId)

    do {
        let jsonData = try encoder.encode(selection)
        defaults?.set(
            jsonData,
            forKey: userDefaultsKey
        )
        let json = String(data: jsonData, encoding: String.Encoding.utf8)

      onChangeBlock?(["isBlocked": true, "blockedApps": json ?? "[]"])
    } catch {
      onChangeBlock?(["isBlocked": false])
    }
  }

  func savedSelection() -> FamilyActivitySelection? {
    let defaults = UserDefaults.init(suiteName: self.childrenId)!

      guard let data = defaults.data(forKey: userDefaultsKey) else {
          return nil
      }

      return try? decoder.decode(
          FamilyActivitySelection.self,
          from: data
      )

  }

    override init(frame: CGRect) {
      super.init(frame: frame)
      let model = ScreenTimeSelectAppsModel()

      model.activitySelection = savedSelection() ?? FamilyActivitySelection(includeEntireCategory: true)

      model.$activitySelection.sink { selection in
        self.saveSelection(selection: selection)
      }
      .store(in: &cancellables)
      setupView(model: model)

    }

    required init?(coder: NSCoder) {
      super.init(coder: coder)
    }

  private func setupView(model: ScreenTimeSelectAppsModel) {
    let view = ScreenTimeSelectAppsContentView(model: model, childrenId: childrenId)
      let vc = UIHostingController(rootView: view)
      vc.view.frame = bounds
      vc.view.backgroundColor = UIColor(white: 1, alpha: 0.0)
      self.addSubview(vc.view)
      self.view = vc.view



    }

    override func layoutSubviews() {
      super.layoutSubviews()
      view?.frame = bounds
    }
}

@available(iOS 16.0, *)
struct ScreenTimeSelectAppsContentView: View {
    @State private var pickerIsPresented = false
    @ObservedObject var model: ScreenTimeSelectAppsModel
    var childrenId: String?
    @State private var showAlert = false

    var body: some View {
        VStack {
            Button {
              // model.sentEvent(event: "BlockApps")
              showAlert = true // Add this line
            } label: {
              Text("").frame(width: 100 , height: 30, alignment: .center).cornerRadius(10)
            }
            .alert(isPresented: $showAlert) {
              Alert(title: Text("Important message"), message: Text("You need to select blocked apps in this session."), dismissButton: .default(Text("Got it!")) {
                pickerIsPresented = true
              })
            }
            .familyActivityPicker(
                isPresented: $pickerIsPresented,
                selection: $model.activitySelection
            ).onChange(of: pickerIsPresented) { newValue in
              if !newValue {
                  // Picker has been dismissed
                Task {
                  await model.startAppRestrictions(childrenId: childrenId)
                }
                showAlert = false
              }
            }

            // if let categoryToken = model.activitySelection.categoryTokens.first {
            //     Label(categoryToken)
            // }
        }
    }

  
}
