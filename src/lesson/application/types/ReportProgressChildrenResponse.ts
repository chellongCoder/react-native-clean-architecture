import ReportProgressChildrenEntity from 'src/lesson/domain/entities/ReportProgressChildrenEntity';

export default interface ReportProgressChildrenResponse {
  message: string;
  data: ReportProgressChildrenEntity[];
}
