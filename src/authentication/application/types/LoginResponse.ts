export default interface LoginResponse {
  message: string;
  code: number;
  data: {
    accessToken: string;
  };
  error?: {
    code: number;
    message: string;
  };
}
