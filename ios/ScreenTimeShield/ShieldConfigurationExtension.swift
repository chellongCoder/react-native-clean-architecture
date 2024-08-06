//
//  ShieldConfigurationExtension.swift
//  ScreenTimeShield
//
//  Created by Longnn on 29/5/24.
//

import ManagedSettings
import ManagedSettingsUI
import UIKit
import SwiftUI
import Intents

let defaultShieldConfiguration = ShieldConfiguration(
  backgroundBlurStyle: .light,
//  backgroundColor: SharedAssets.uistepperBGPurple1.withAlphaComponent(0.1),
  backgroundColor: UIColor.red.withAlphaComponent(0.1),
  icon: UIImage(named: "AppLock"),
  title: ShieldConfiguration.Label(text: "Screentime disabled by the app", color: Color(hex: "#FBF8CC").toUIColor()),
  subtitle: ShieldConfiguration.Label(text: "Press unblock in the apps to enable", color: Color(hex: "#FBF8CC").toUIColor())
)

// Override the functions below to customize the shields used in various situations.
// The system provides a default appearance for any methods that your subclass doesn't override.
// Make sure that your class name matches the NSExtensionPrincipalClass in your Info.plist.
class ShieldConfigurationExtension: ShieldConfigurationDataSource {
    override func configuration(shielding application: Application) -> ShieldConfiguration {
        // Customize the shield as needed for applications.
      return defaultShieldConfiguration
    }
    
    override func configuration(shielding application: Application, in category: ActivityCategory) -> ShieldConfiguration {
        // Customize the shield as needed for applications shielded because of their category.
      return defaultShieldConfiguration
    }
    
    override func configuration(shielding webDomain: WebDomain) -> ShieldConfiguration {
        // Customize the shield as needed for web domains.
      return defaultShieldConfiguration
    }
    
    override func configuration(shielding webDomain: WebDomain, in category: ActivityCategory) -> ShieldConfiguration {
        // Customize the shield as needed for web domains shielded because of their category.
      return defaultShieldConfiguration
    }
}
