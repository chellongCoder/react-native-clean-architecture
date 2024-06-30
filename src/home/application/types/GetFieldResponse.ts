export interface FieldData {
  _id: string;
  name: string;
  description: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export default interface GetFieldResponse {
  message: string;
  data: FieldData[];
  error?: {
    code: number;
    message: string;
  };
}
