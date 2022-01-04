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

export async function initReport(): Promise<ReportID> {
  const report: Report & { _id: string } = {
    _id: uuid(),
    rows: [],
    date: new Date(),
  };

  await ReportsDB.put(report);
  return id;
}

export async function insertReportRow(reportId: ReportID, userID: UserID, name: string, email: string, role: Role, projectName: string, hours: number, earnings: number, client: string) {
  const report = await findReportById(reportId);
  const row = {
    userID, name, email, role, projectName, hours, earnings, client,
  };
  report.rows.push(row);
  await ReportsDB.put(report);
}
