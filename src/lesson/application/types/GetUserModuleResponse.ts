export interface UserModule {
  createdAt: string;
  lessonId: string;
  parentId: string;
  updatedAt: string;
  _id: string;
}

export type GetUserModuleResponse = UserModule[];
