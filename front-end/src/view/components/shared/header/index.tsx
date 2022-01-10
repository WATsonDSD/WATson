import React, { useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { CSVDownload } from 'react-csv';
import { Paths } from '../routes';
import { useDialog } from '../../../../utils/modals';
import { Role, useUserNotNull } from '../../../../data';
import { CreateUserDialog } from '../dialogs';

import UserSettings from '../sidebar/UserSettings';
import PlusIcon from '../../../../assets/icons/plus.svg';
import generateReport from '../../../../data/financier';
import { refetchReport as refetchReports } from '../../projectFinanceSummary/ReportFinance';

export default function Header(props: { title: string}) {
  const { title } = props;

  const [user] = useUserNotNull();

  // this is for generating report button
  const [rows, setRows] = useState< {user: string;
    name: string;
    email: string;
    role: Role;
    projectName: string;
    hours: number;
    payment: number;
    client: string;}[]>([]);

  const headers = [
    { label: 'ID', key: 'id' },
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Role', key: 'role' },
    { label: 'Project', key: 'projectName' },
    { label: 'Hours Of Work', key: 'hours' },
    { label: 'Earnings', key: 'payment' },
    { label: 'Client', key: 'client' },
  ];

  const location = useLocation();
  const navigate = useNavigate();

  const dialog = useDialog();

  const actions: {[role: string]: {[path: string] : VoidFunction }} = {
    projectManager: {
      [Paths.Projects]: () => navigate(Paths.CreateProject),
      [Paths.Workers]: () => dialog.open(<CreateUserDialog onClose={dialog.close} />),
    },
    finance: {
      [Paths.Reports]: () => {
        generateReport().then((result) => {
          setRows(result.reportRow);
          refetchReports();
        });
      },
    },
  };

  return (
    <header className="flex items-center justify-between bg-white sticky top-0 z-10">
      {Object.entries(rows).length > 0 ? <CSVDownload data={rows} headers={headers} filename="report.csv" target="_blank" /> : null }

      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-medium uppercase items-start">{title}</h1>
        { user && actions[user.role] && actions[user.role][location.pathname] && (
        <button type="button" onClick={actions[user.role][location.pathname]} className="flex justify-center items-center bg-gray-100 hover:bg-gray-200 transition-colors duration-200 w-10 h-10 rounded-full">
          <img src={PlusIcon} alt="Action" />
        </button>
        )}
      </div>
      <UserSettings />
    </header>
  );
}
