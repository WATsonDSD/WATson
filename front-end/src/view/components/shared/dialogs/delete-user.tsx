import React from 'react';

import { Worker } from '../../../../data';

export function DeleteUserDialog(props: {onClose: VoidFunction, user: Worker}) {
  const { onClose, user } = props;

  return (
    <div className="max-w-sm">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-xl font-medium">You are about to delete this user</h1>
        <p className="text-justify text-gray-600">This action is irriversible. Are you sure you want to proceed?</p>
      </div>
      <div className="flex justify-end gap-x-4 mt-8">
        <button type="button" className="text-gray-400 hover:text-gray-600" onClick={() => onClose()}>Cancel</button>
        <button
          type="button"
          onClick={() => {
            // TODO call here the delete user function
            console.log(user);
            onClose();
          }}
          className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

export default { DeleteUserDialog };
