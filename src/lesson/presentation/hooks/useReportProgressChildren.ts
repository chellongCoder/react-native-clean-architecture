import {useCallback, useMemo, useState} from 'react';
import {useLessonStore} from '../stores/LessonStore/useGetPostsStore';
import ReportProgressChildrenPayload from 'src/lesson/application/types/ReportProgressChildrenPayload';
import ReportProgressChildrenEntity from 'src/lesson/domain/entities/ReportProgressChildrenEntity';

const useReportProgressChildren = () => {
  const [reports, setReports] = useState<ReportProgressChildrenEntity[]>([]);
  const {handleGetReportProgressChildren} = useLessonStore();

  const statisticsByMonth = useMemo(() => {
    return reports.reduce(
      (statistics, item) => {
        if (!item.date) {
          return statistics;
        }
        const dayOfWeek = new Date(item.date).getDay() || 7;
        statistics[dayOfWeek - 1] = {
          total: statistics[dayOfWeek - 1].total + item.total,
          totalPoint: statistics[dayOfWeek - 1].totalPoint + item.totalPoint,
        };
        return statistics;
      },
      Array.from({length: 7}, () => ({total: 0, totalPoint: 0})),
    );
  }, [reports]);

  const totalPoint = useMemo(
    () => reports.reduce((sum, item) => sum + item.totalPoint, 0),
    [reports],
  );

  const getReportProgressChildren = useCallback(
    async ({
      childrenId,
      endDate,
      startDate,
      typeReport,
    }: ReportProgressChildrenPayload) => {
      if (!childrenId) {
        console.warn('--- Error: childrenId require ---');
        return;
      }
      const res = await handleGetReportProgressChildren({
        childrenId,
        typeReport,
        startDate,
        endDate,
      });
      if (res.data) {
        setReports(res.data);
      }
      return res.data;
    },
    [handleGetReportProgressChildren],
  );

  const getReportByMonth = useCallback(
    async ({
      childrenId,
      typeReport,
      month,
    }: Pick<ReportProgressChildrenPayload, 'childrenId' | 'typeReport'> & {
      month: number;
    }) => {
      return getReportProgressChildren({
        childrenId,
        typeReport,
        startDate: getStartOfMonth(month).toISOString(),
        endDate: getEndOfMonth(month).toISOString(),
      });
    },
    [getReportProgressChildren],
  );

  return {
    reports,
    statisticsByMonth,
    totalPoint,
    getReportProgressChildren,
    getReportByMonth,
  };
};

export default useReportProgressChildren;

const getStartOfMonth = (month: number) => {
  return new Date(new Date().getFullYear(), month - 1, 1);
};

const getEndOfMonth = (month: number) => {
  return new Date(new Date().getFullYear(), month, 0, 23, 59, 59, 59);
};
