//
//  ShieldConfigurationExtension.swift
//  ScreenTimeShield
//
//  Created by Longnn on 29/5/24.
//

import ManagedSettings
import ManagedSettingsUI
import UIKit
let defaultShieldConfiguration = ShieldConfiguration(
  backgroundColor: UIColor.systemBackground,
  icon: UIImage(systemName: "moon.circle.fill",
                variableValue: 1,
                configuration: UIImage.SymbolConfiguration(hierarchicalColor: .systemIndigo)),
  title: ShieldConfiguration.Label(text: "Screentime disabled by the app", color: .label),
  subtitle: ShieldConfiguration.Label(text: "Press unblock in the apps to enable", color: .label)
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
