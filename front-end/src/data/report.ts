import { v4 as uuid } from 'uuid';
import {
  Report, ReportID, Role, UserID,
} from '.';
import { ReportsDB } from './databases';
//  user: UserID, name: string, mail: string, role: Role, project: ProjectID, hours: number, payment: number, client: string
export async function createReport() : Promise<Report> {
  const id = uuid(); // unique id's.

  const report = {
    _id: id,
    reportID: id,
    date: new Date(),
    reportRow: [],
  } as Report & {_id: string};

  await ReportsDB.put(report);
  return report;
}

export async function findReportById(id: ReportID): Promise<Report & {_id: string, _rev: string}> {
  return ReportsDB.get(id);
}

export async function insertReportRow(reportId: ReportID, user: UserID, name: string, email: string, role: Role, projectName: string, hours: number, payment: number, client: string) {
  const report = await findReportById(reportId);
  const row = {
    user, name, email, role, projectName, hours, payment, client,
  };
  console.log(report.reportRow);
  report.reportRow.push(row);
  console.log(report.reportRow);
  await ReportsDB.put(report);
}
