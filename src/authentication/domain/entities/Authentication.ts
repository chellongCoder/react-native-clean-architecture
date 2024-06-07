export default interface AuthenticationEntity {
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
