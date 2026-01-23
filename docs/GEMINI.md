# Gemini Context: TBD-Edu React Native App

## Project Overview

This is a React Native mobile application named "ABeeCi" (`tbd-edu`). It is built with TypeScript and follows a clean architecture pattern, separating the codebase into `domain`, `application`, `infrastructure`, and `presentation` layers. The project uses Expo as a framework, with `expo-dev-client` for custom native code.

**Key Technologies:**

*   **Framework:** React Native with Expo
*   **Language:** TypeScript
*   **State Management:** Mobx (`mobx`, `mobx-react`)
*   **Navigation:** React Navigation (`@react-navigation/native`)
*   **Dependency Injection:** `inversify-sugar`
*   **API Client:** Axios
*   **Authentication:** The app includes email/password and Google Sign-In authentication. It uses `@react-native-google-signin/google-signin` for the Google login flow.
*   **Internationalization (i18n):** `expo-localization` and `i18n-js`
*   **Linting & Formatting:** ESLint, Prettier, and CommitLint are configured.

## Building and Running

The project uses Yarn as its package manager.

**Key Commands:**

*   **Install Dependencies:**
    ```bash
    yarn
    ```
*   **Run Development Server (for Expo Go or dev client):**
    ```bash
    yarn dev
    ```
*   **Run on Android (dev client):**
    ```bash
    yarn android
    ```
*   **Run on iOS (dev client):**
    ```bash
    yarn ios
    ```
*   **Run on Web:**
    ```bash
    yarn web
    ```
*   **Lint the Code:**
    ```bash
    yarn lint
    ```

## Development Conventions

*   **Clean Architecture:** The codebase is structured into four main layers within each feature module (e.g., `src/authentication`):
    *   `domain`: Contains entities, specifications, and business rules.
    *   `application`: Contains use cases.
    *   `infrastructure`: Implements the domain layer, handling things like API calls.
    *   `presentation`: Contains React Native components, screens, and state management (Mobx stores).
*   **Dependency Injection:** `inversify-sugar` is used to manage dependencies, with `AppModule.ts` as the root module.
*   **State Management:** Mobx is used for state management. Stores are often defined within the `presentation/stores` directory of a feature module.
*   **Typing:** The project uses TypeScript, and the README emphasizes "bulletproof typing".
*   **Commits and Git Hooks:** `commitlint` is used to enforce conventional commit messages, and `husky` manages pre-commit hooks (e.g., for linting).
*   **File Naming:** Files appear to be named using PascalCase for components and classes (e.g., `LoginScreen.tsx`, `AuthenticationRepository.ts`) and camelCase for hooks and other functions.
*   **API Endpoints:** API endpoints are centralized in `src/core/presentation/constants/apiEndpoints.ts` (inferred from `AuthenticationRepository.ts`). Configuration details, including API URLs and client IDs, are stored in `app.config.ts`.
