export default interface ReportProgressChildrenEntity {
  total: number;
  totalPoint: number;
  //daily and monthly
  _id: string;
  date: string;
  //weekly
  endDate: string;
  startDate: string;
  week: string;
}
