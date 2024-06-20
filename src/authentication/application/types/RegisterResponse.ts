export default interface RegisterResponse {
  message: string;
  code: number;
  data: {
    accessToken: string;
    refreshToken: string;
  };
  error?: {
    code: number;
    message: string;
  };
}
