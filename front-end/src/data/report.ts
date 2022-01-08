import { v4 as uuid } from 'uuid';
import {
  Report, ReportID, ReportsDB,
} from '.';

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

export async function insertReportRows(reportId: ReportID, rows: any[]): Promise<any> {
  const report = await findReportById(reportId);
  report.reportRow = rows;
  await ReportsDB.put(report);
}

export async function getAllReports(): Promise<Report[]> {
  let reports: Report[] = [];
  return new Promise((resolve, reject) => {
    ReportsDB.allDocs({
      startkey: 'a',
      include_docs: true,
    }).then((response) => {
      if (response) {
        reports = response.rows.map((row: any) => ({
          reportID: row.doc.reportID,
          date: row.doc.date,
          reportRow: row.doc.reportRow,
        } as Report));
      }
      resolve(reports);
    }).catch((error) => {
      reject(error);
    });
  });
}
