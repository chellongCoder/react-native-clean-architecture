export default interface DeleteChildrenResponse {
  data?: {
    acknowledged: boolean;
    modifiedCount: number;
    upsertedId: null;
    upsertedCount: number;
    matchedCount: number;
  };
  message: string;
}
