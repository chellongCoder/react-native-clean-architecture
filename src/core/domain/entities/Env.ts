export const EnvToken = Symbol('Env');

export default interface Env {
  EXPO_BASE_API_DOMAIN: string;
  EXPO_BASE_API_URL: string;
  IMAGE_QUESTION_BASE_API_URL: string;
  IMAGE_MODULE_BASE_API_URL: string;
  IMAGE_BACKGROUND_BASE_API_URL: string;
}
