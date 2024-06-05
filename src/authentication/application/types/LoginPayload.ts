export interface LoginUsernamePasswordPayload {
  email: string;
  password: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LoginWith4GPayload {}

export enum SocialName {
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
}

export interface LoginWithGooglePayload {
  accessToken: string | null;
  provider: SocialName;
}
