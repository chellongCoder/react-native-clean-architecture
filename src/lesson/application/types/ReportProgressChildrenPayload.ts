export default interface ReportProgressChildrenPayload {
  childrenId: string;
  typeReport: 'daily' | 'weekly' | 'monthly';
  startDate: string; //utc
  endDate: string; //utc
}
