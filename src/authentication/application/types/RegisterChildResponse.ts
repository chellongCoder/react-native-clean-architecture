export default interface RegisterChildResponse {
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
