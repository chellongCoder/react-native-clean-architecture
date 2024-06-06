export default interface RegisterResponse {
  message: string;
  code: number;
  data: {
    accessToken: string;
  };
}
