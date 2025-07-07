export interface FieldData {
  _id: string;
  name: string;
  name_vi: string;
  description: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export default interface GetFieldResponse {
  message: string;
  data: FieldData[];
  error?: {
    code: number;
    message: string;
  };
}
