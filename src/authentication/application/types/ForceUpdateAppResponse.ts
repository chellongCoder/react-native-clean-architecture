export interface ForceUpdateAppResponse {
  data: {
    _id: string;
    version: string;
    platform: string;
    isForce: boolean;
    isDeleted: boolean;
    appStoreLink: string;
    playStoreLink: string;
    createAt: string;
    updateAt: string;
  };
}
