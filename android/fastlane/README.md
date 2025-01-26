fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## Android

### android test

```sh
[bundle exec] fastlane android test
```

Runs all the tests

### android beta

```sh
[bundle exec] fastlane android beta
```

Submit a new Beta Build to Crashlytics Beta

### android deploy

```sh
[bundle exec] fastlane android deploy
```

Deploy a new version to the Google Play

### android buildAab

```sh
[bundle exec] fastlane android buildAab
```

Build AAB

### android increment_version_code

```sh
[bundle exec] fastlane android increment_version_code
```

Increment versionCode

### android upload_to_firebase

```sh
[bundle exec] fastlane android upload_to_firebase
```

Build and upload APK to Firebase App Distribution

### android build_and_upload_aab

```sh
[bundle exec] fastlane android build_and_upload_aab
```

Build AAB and upload to public testing on Play Console

### android build_and_upload_aab_closed

```sh
[bundle exec] fastlane android build_and_upload_aab_closed
```

Build and upload AAB to closed testing on Play Console

### android build_and_upload_aab_internal

```sh
[bundle exec] fastlane android build_and_upload_aab_internal
```

Build and upload AAB to internal testing on Play Console

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
