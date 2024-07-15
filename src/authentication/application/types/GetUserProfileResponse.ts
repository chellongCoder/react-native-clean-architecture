export interface children {
  _id: string;
  age: number;
  createdAt: string;
  emailOrPhoneNumber: string;
  gender: string;
  isDeleted: false;
  name: string;
  parentId: string;
  password: string;
  updatedAt: string;
  userType: 'child' | 'parent';
  username: string;
  description: string;
}

export interface data {
  _id: string;
  emailOrPhoneNumber: string;
  username: string;
  name: string;
  userType: 'child' | 'parent';
  createdAt: string;
  updatedAt: string;
  children: children[];
}

export default interface GetUserProfileResponse {
  message: string;
  code: number;
  data: data;
  error?: {
    code: number;
    message: string;
  };
}
