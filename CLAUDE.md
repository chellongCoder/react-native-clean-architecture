# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## App Overview

**ABeeCi** — a children's educational React Native app (Expo managed workflow, bare). Targets iOS and Android. Uses CodePush for OTA updates via a self-hosted server.

## Commands

```bash
# Development
yarn dev                    # Start Expo dev client
yarn android                # Run Android devDebug variant
yarn android:devRelease     # Run Android DevRelease variant
yarn android:prodRelease    # Run Android ProdRelease variant
yarn ios                    # Run iOS

# Code quality
yarn lint                   # ESLint (zero warnings allowed)

# Tests
yarn jest                   # Run all tests
yarn jest <path>            # Run a single test file

# Assets & i18n
yarn link:assets            # Link native assets
yarn gen:i18n               # Regenerate i18n locale files

# OTA / CodePush
yarn codepush:safe          # Run CodePush with bundle analysis

# Bundle analysis
yarn bundle:analyze         # Analyze bundle size
yarn bundle:check           # Monitor asset sizes
```

## Architecture

Clean Architecture with bounded contexts. The `src/` folder contains:

```
src/
├── AppModule.ts             # DI root — imports all feature modules
├── core/                    # Cross-cutting concerns (HTTP, i18n, env, IAP store)
├── authentication/          # Auth flow (login, register, token management)
├── home/                    # Home screen, subjects, module listing
├── lesson/                  # Lesson playback, progress, ranking, purchases
├── achievement/             # Achievement tracking
├── rank/                    # Leaderboard / ranking
├── post/                    # Posts/feed
├── modules/                 # Custom native Expo modules (expo-settings, expo-screen-time, text-to-speech-rn, react-native-alphadex-screentime)
└── hooks/                   # Root-level hooks (useHydration, usePermissionApplock)
```

Each feature module (`authentication`, `lesson`, etc.) follows the same four-layer structure:

| Layer | Purpose |
|---|---|
| `domain/` | Entities, repository interfaces (specifications) |
| `application/` | Use cases implementing `UseCase<Payload, Response>` |
| `infrastructure/` | Repository implementations (API calls via HttpClient) |
| `presentation/` | Screens, MobX stores, hooks, components |
| `[Context]Module.ts` | InversifySugar DI module — registers all providers |

## Dependency Injection

Uses **InversifySugar** (`inversify-sugar`). The app bootstraps via `InversifySugar.run(AppModule)` in `index.js` before mounting the root component.

- All stores, use cases, and repositories are decorated with `@injectable()` / `@provided(Token)`.
- Feature modules declare providers in a `@module({ providers: [...] })` class.
- To access a singleton outside a component tree: `featureModuleContainer.getProvided(StoreClass)`.
- `CoreModule` registers global singletons: `IHttpClientToken` (HttpClient), `EnvToken` (env config), `IapStore`.

## State Management

**MobX** is the state manager. Stores live in `presentation/stores/`.

- Stores are `@injectable()` classes with `makeAutoObservable(this)`.
- Persistent fields use `@persist` from `mobx-persist` (backed by AsyncStorage).
- `hydrate` function from `AuthenticationStore.ts` is the AsyncStorage persistence helper.
- React bindings: `observer()` from `mobx-react`; context-based store providers (e.g., `LessonStoreProvider`).
- Use `useContextStore` hook pattern to consume stores in components.

## Navigation

**React Navigation v6** with `@react-navigation/stack`.

- All route names are string constants in `src/core/presentation/navigation/ConstantNavigator.ts` — always use these, never inline strings.
- `RootNavigator` → `AppNavigator` (function returning `<AppStack.Screen>` elements) → feature stacks.
- Imperative navigation via `RootNavigationActions.ts` (`resetNavigator`, `navigate`, etc.) — use this for navigation outside component scope (e.g., from stores).
- Bottom tab visibility is toggled per-screen via `showBottomTab` / `hideBottomTab` focus listeners.

## HTTP & Auth

`HttpClient` (`src/core/infrastructure/implementations/HttpClient.ts`) wraps Axios:

- Base URL comes from `Env` injected at construction time (from `app.config.ts` extra → `expo-constants`).
- Sets `X-Device-Token` header from `AuthenticationStore.deviceToken`.
- **Auto token refresh**: on 401/403, queues concurrent requests and retries after `refreshToken` completes. If refresh fails, calls `handleUserLogOut()` and redirects to login.
- Authentication: JWT Bearer token set via `httpClient.setAuthCredentials()`.
- Credentials (username/password) stored in native Keychain via `react-native-keychain`.

## Design Tokens

- **Colors**: `src/core/presentation/constants/colors.ts` → `COLORS` object.
- **Typography**: `src/core/presentation/constants/typography.ts` → `TYPOGRAPHY` sizes/families + `CustomTextStyle` StyleSheet.
- **Fonts**: SVN-Neuzeit Grotesk (Regular/Bold), SVN-Cherish Moment, Roboto. Loaded via `useFonts` hook.
- Always use `COLORS.*` and `TYPOGRAPHY.*` — never hardcode hex values or font sizes.

## Environment & Config

App config lives in `app.config.ts`. Environment values are accessed at runtime via `Constants.expoConfig?.extra` (exposed through the `EnvToken` DI token). Key env vars:

- `EXPO_BASE_V1_API_DOMAIN` — primary API base URL
- `CODEPUSH_SERVER_URL` / `CODEPUSH_DEPLOYMENT_KEY` — OTA update config
- `IMAGE_*_BASE_API_URL` — GCS image CDN prefixes

## Android Build Variants

Three variants configured in `android/app/build.gradle`:
- `devDebug` — development
- `DevRelease` — staging/release testing
- `ProdRelease` — production (Play Store)

Fastlane is available in `android/fastlane/` for automated builds.

## Testing

Jest with `preset: 'react-native'`. Tests live in `__tests__/`. Run a specific test:

```bash
yarn jest __tests__/MyComponent.test.tsx
```

## Key Conventions

- **UseCase pattern**: all application logic lives in use cases implementing `UseCase<Payload, Response>` with a single `execute()` method.
- **No Redux** — `@reduxjs/toolkit` is installed but MobX is the actual state manager.
- **No default exports** from stores or use cases — they are `@injectable()` classes imported by name.
- **`withProviders` HOC**: used to compose multiple context providers around a screen (see `RootNavigator.tsx`).
- **Global providers** in `App.tsx`: Loading, Crashlytics, Offline, Sound, TTS, Authentication, IAP, CodePush — wrap the entire navigator.
- **Font scaling disabled globally** in `App.tsx` via `Text.defaultProps.allowFontScaling = false`.
- **Device token**: uses a UUID stored in AsyncStorage (`@app_device_token`), not a hardware device ID (Google Families Policy compliance).
