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
  var onSelectEvent: RCTDirectEventBlock? = nil
  let model = ScreenTimeSelectAppsModel()
  private var cancellables = Set<AnyCancellable>()
  private let userDefaultsKey = "ScreenTimeSelection"
  private let encoder = JSONEncoder()
  private let decoder = JSONDecoder()

  @objc var color: String = "" {
    didSet {
    }
  }

  var view: UIView?

  func saveSelection(selection: FamilyActivitySelection) {
    let defaults = UserDefaults.init(suiteName: "group.screentime.expo")!

    defaults.set(
        try? encoder.encode(selection),
        forKey: userDefaultsKey
    )

    self.onSelectEvent?([:])
  }

  func savedSelection() -> FamilyActivitySelection? {
      let defaults = UserDefaults.init(suiteName: "group.screentime.expo")!

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
      setupView()
    }

    required init?(coder: NSCoder) {
      super.init(coder: coder)
      setupView()
    }

    private func setupView() {
      let view = ScreenTimeSelectAppsContentView(model: model)
      let vc = UIHostingController(rootView: view)
      vc.view.frame = bounds
      self.addSubview(vc.view)
      self.view = vc.view

      model.activitySelection = savedSelection() ?? FamilyActivitySelection(includeEntireCategory: true)

      model.$activitySelection.sink { selection in
        self.saveSelection(selection: selection)
      }
      .store(in: &cancellables)

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

    var body: some View {
        VStack {
            Button {
                pickerIsPresented = true
            } label: {
                Text("Select Apps")
            }
            .familyActivityPicker(
                isPresented: $pickerIsPresented,
                selection: $model.activitySelection
            )
            // if let categoryToken = model.activitySelection.categoryTokens.first {
            //     Label(categoryToken)
            // }
        }
    }

  
}