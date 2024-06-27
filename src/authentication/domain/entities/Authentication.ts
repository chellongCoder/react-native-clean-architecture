export default interface AuthenticationEntity {
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
