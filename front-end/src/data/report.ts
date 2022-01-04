import { v4 as uuid } from 'uuid';

import {
  DBDocument,
  Role,
  UserID,
  Report,
  ReportID,
  ReportsDB,
} from '.';

export async function findReportById(id: ReportID): Promise<DBDocument<Report>> {
  return ReportsDB.get(id);
}

export function initReport(): Report & { _id: string } {
  const report: Report & { _id: string } = {
    _id: uuid(),
    rows: [],
    date: new Date(),
  };

  return report;
}

export function insertReportRow(report: Report & { _id: string }, userID: UserID, name: string, email: string, role: Role, projectName: string, client: string, hours: number, earnings: number) {
  const updatedReport: Report & { _id: string } = report;

  updatedReport.rows.push({
    userID,
    name,
    email,
    role,
    projectName,
    client,
    hours,
    earnings,
  });

  return updatedReport;
}
