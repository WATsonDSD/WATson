import React from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { Paths } from '../routes';
import { useDialog } from '../../../../utils/modals';
import { useUserNotNull } from '../../../../data';
import { CreateUserDialog } from '../dialogs';

import UserSettings from '../sidebar/UserSettings';
import PlusIcon from '../../../../assets/icons/plus.svg';

export default function Header(props: { title: string}) {
  const { title } = props;

  const [user] = useUserNotNull();

  const location = useLocation();
  const navigate = useNavigate();

  const dialog = useDialog();

  const actions: {[role: string]: {[path: string] : VoidFunction }} = {
    projectManager: {
      [Paths.Projects]: () => navigate(Paths.CreateProject),
      [Paths.Workers]: () => dialog.open(<CreateUserDialog onClose={dialog.close} />),
    },
    finance: {
    },
    annotator: {
    },
    verifier: {
    },
  };

  return (
    <header className="flex items-center justify-between bg-white sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-medium uppercase items-start">{title}</h1>
        { user && actions[user.role][location.pathname] && (
        <button type="button" onClick={actions[user.role][location.pathname]} className="flex justify-center items-center bg-gray-100 hover:bg-gray-200 transition-colors duration-200 w-10 h-10 rounded-full">
          <img src={PlusIcon} alt="Action" />
        </button>
        )}
      </div>
      <UserSettings />
    </header>
  );
}
