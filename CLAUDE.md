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

| Layer                | Purpose                                               |
| -------------------- | ----------------------------------------------------- |
| `domain/`            | Entities, repository interfaces (specifications)      |
| `application/`       | Use cases implementing `UseCase<Payload, Response>`   |
| `infrastructure/`    | Repository implementations (API calls via HttpClient) |
| `presentation/`      | Screens, MobX stores, hooks, components               |
| `[Context]Module.ts` | InversifySugar DI module — registers all providers    |

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

- All route names are string constants in `src/core/presentation/navigation/ConstantNavigator.ts` — always use these, n ever inline strings.
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

## Quy tắc làm việc với Claude

- **Sau mỗi câu trả lời, Claude phải gợi ý bước tiếp theo cần làm.** Không dừng lại ở việc sửa code — hãy tư duy như người giải quyết vấn đề tận gốc rễ: chỉ ra nguyên nhân gốc, tác động liên quan, và hành động tiếp theo cần thực hiện để hoàn toàn giải quyết vấn đề.

---

## 🧠 Session Memory (Claude tự cập nhật)

### 📍 Tiến độ review LessonComponent

| Môn     | Module                                                  | Trạng thái                |
| ------- | ------------------------------------------------------- | ------------------------- |
| English | EG0M1–3 → `LatinLesson`                                 | ✅ Đã refactor TTS        |
| English | EG1M1–8 → `EssayLesson`                                 | ✅ Đã refactor TTS        |
| English | EG2M → `English_QwertyKeyboard`, `English_SelectText`   | 🔄 **Đang check đến đây** |
| English | EG1M9–17 → `English_EG4M23`                             | ✅ Đã refactor TTS        |
| English | EG2M1,3,5,7,9 → `VowelsLesson`                          | ✅ Đã refactor TTS        |
| English | EG2M11 → `English_DrawerCharacter`                      | ✅ Đã refactor TTS        |
| English | EG2M(2,4,6,8,10,13,14,15,17) → `English_Pronounciation` | ⏳ Chưa check             |
| English | EG2M(16,22–54) → `English_SelectAnswer`                 | ✅ Đã refactor TTS        |
| English | EG2M(18,19,20,21,30,33,35) → `English_CombineSentences` | ✅ Đã refactor TTS        |
| English | EG2M → `English_QwertyKeyboard`                         | ✅ Đã refactor TTS        |
| English | EG2M → `English_SelectText`                             | ✅ Đã refactor TTS        |
| English | EG2M12 → `MultiPronunciationLesson`                     | ⏳ Chưa check             |

> Hỏi "đang check đến module nào?" → Claude trả lời: **English EG1 M2**

---

### ✅ Việc đã làm hôm nay (2026-04-07)

#### 1. Tạo hook `useLessonSpeech` (generic TTS hook)

- **File**: `src/lesson/presentation/hooks/useLessonSpeech.ts`
- **Mục đích**: Thay thế logic TTS inline lặp lại ở nhiều component
- **Tính năng**: Auto-speak khi focus (delay 1500ms), cleanup `ttsStop` khi unfocus, expose `onSpeechText` cho VoiceButton, `isSpeaking` state
- **Backward compat**: `History/hook.ts` re-export alias `useHistoryModule` → 18 file History không bị break

#### 2. Refactor `LatinLesson.tsx`

- Bỏ: `TextToSpeechContext`, `useIsFocused`, `useContext`, `onSpeechText` callback, `useEffect` double-speak
- Dùng: `useLessonSpeech({ text: getCorrectAnswer(correctAnswer) })`

#### 3. Refactor `EssayLesson.tsx`

- Bỏ: `TextToSpeechContext`, `useIsFocused`, `useContext`, `useCallback`, `onSpeechText` callback, `useEffect` focus/speech
- Dùng: `useLessonSpeech({ text: correctAnswer })`
- Lưu ý: `useImperativeHandle` vẫn expose `onSpeechText` từ hook (caller bên ngoài dùng ref)

#### 4. Fix `useSettingLesson.ts` — tiktak sound

- **Bug cũ**: `playSound(tiktak)` bật ngay khi `learningTimer === 0` → phát suốt cả giai đoạn làm bài
- **Fix**: Chỉ bật khi `time <= 10 && time > 0`, tắt khi `time === 0`
- **Cleanup**: `pauseSound()` + reset `playSoundRef` trong unmount effect

---

### ⚠️ Vấn đề phát hiện, chưa fix

#### LessonComponent.tsx — khoảng trắng ở đáy

- **Triệu chứng**: Màn `LatinLesson` (ENGLISH_EG0M1) có blank space ở cuối answer section
- **Root cause nghi ngờ**:
  1. `insets.bottom` không được dùng (chỉ có `insets.top`) → safe area bottom không được padding
  2. `h450` dùng `height: '50%'` cứng → không responsive với các device có navigation bar khác nhau
  3. `CanvasWrite` có `flex: 1` nhưng cần trace lại chain từ `BookView` → `boxAnswer`
- **Chưa fix**, cần thêm `paddingBottom: insets.bottom` vào container phù hợp

#### LESSON_PATTERNS — case-sensitive bug

- Tất cả pattern dùng chữ hoa `M` (vd: `ENGLISH_EG1M1`) nhưng server có thể trả về chữ thường `m`
- `.test(questionType)` không có case normalization → type `ENGLISH_EG1m1` sẽ không match → render null
- **Chưa fix**, nên thêm `questionType.toUpperCase()` trước khi test

---

### 🔍 Quan sát kỹ thuật về project

#### Pattern lặp lại (cần refactor dần)

- **TTS logic** bị copy-paste ở rất nhiều lesson component (History ~18 files, English, Latin...) → đã tạo `useLessonSpeech`, cần áp dụng tiếp cho các component còn lại
- `onSpeechText` + `useIsFocused` + `useContext(TextToSpeechContext)` xuất hiện ở hầu hết lesson component

#### Kiến trúc LessonScreen

- `LESSON_PATTERNS` dùng regex array để map type → component (lazy loaded) — đây là pattern tốt cho code splitting
- Có ~100+ lesson components, mỗi cái là 1 lazy import riêng
- Regex patterns không có flag `i` → dễ bị lỗi case mismatch với data từ server

#### Performance concerns

- Rất nhiều `lazy()` import trong LessonScreen → bundle splitting tốt nhưng cần đảm bảo Suspense fallback mượt
- `useSettingLesson` là hook nặng (TTS, countdown, sound, volume, speech-to-text, translate) — được dùng ở hầu hết lesson component
- `BookView` dùng SVG `height={3000}` cố định → có thể gây paint overhead trên low-end Android

---

## Key Conventions

- **UseCase pattern**: all application logic lives in use cases implementing `UseCase<Payload, Response>` with a single `execute()` method.
- **No Redux** — `@reduxjs/toolkit` is installed but MobX is the actual state manager.
- **No default exports** from stores or use cases — they are `@injectable()` classes imported by name.
- **`withProviders` HOC**: used to compose multiple context providers around a screen (see `RootNavigator.tsx`).
- **Global providers** in `App.tsx`: Loading, Crashlytics, Offline, Sound, TTS, Authentication, IAP, CodePush — wrap the entire navigator.
- **Font scaling disabled globally** in `App.tsx` via `Text.defaultProps.allowFontScaling = false`.
- **Device token**: uses a UUID stored in AsyncStorage (`@app_device_token`), not a hardware device ID (Google Families Policy compliance).
