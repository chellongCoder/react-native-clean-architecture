export default interface LoginResponse {
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

export interface RefreshTokenResponse {
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
