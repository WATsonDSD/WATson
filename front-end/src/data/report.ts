import { v4 as uuid } from 'uuid';

import {
  Report,
  ReportID,
  ReportsDB,
  Role,
  UserID,
} from '.';

export async function createReport() : Promise<ReportID> {
  const id = uuid(); // unique id's.

  const report = {
    _id: id,
    reportID: id,
    date: new Date(),
    rows: [],
  } as Report & {_id: string};

  await ReportsDB.put(report);
  return id;
}

export async function findReportById(id: ReportID): Promise<Report & {_id: string, _rev: string}> {
  return ReportsDB.get(id);
}

export async function insertReportRow(reportId: ReportID, userID: UserID, name: string, email: string, role: Role, projectName: string, hours: number, earnings: number, client: string) {
  const report = await findReportById(reportId);
  const row = {
    userID, name, email, role, projectName, hours, earnings, client,
  };
  report.rows.push(row);
  await ReportsDB.put(report);
}
