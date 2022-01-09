import React, { useRef } from 'react';

import { UpdateUserError } from '../../../../utils/errors';
import { Worker, updateUser } from '../../../../data';
import { useSnackBar, SnackBarType } from '../../../../utils/modals';

export function EditUserDialog(props: {onClose: VoidFunction, user: Worker}) {
  const { onClose, user } = props;

  const name = useRef<HTMLInputElement>(null);

  const snackBar = useSnackBar();

  async function onSave() {
    if (name.current && name.current?.value.length > 0 && name.current?.value !== user.name) {
      updateUser({ ...user, name: name.current.value })
        .catch(() => { throw new UpdateUserError('We could not update the user name, please try again later...'); });
    }
  }

  return (
    <>
      <h1 className="text-xl font-medium mb-4">Edit user profile</h1>

      <div className="px-2 mt-8 flex flex-col gap-y-6">
        <div className="flex justify-between gap-x-4">
          <label htmlFor="name" className="flex flex-col items-start text-sm text-gray-400">
            Full name
            <input id="name" name="name" type="text" ref={name} placeholder={user.name ?? 'loading'} className="pb-1 text-gray-800 text-lg border-b focus:outline-none" />
          </label>
          <label htmlFor="role" className="flex flex-col items-start text-sm text-gray-400">
            Role
            <input id="role" name="role" type="text" readOnly value={user.role ?? 'loading'} className="capitalize pb-1 text-gray-800 text-lg border-b focus:outline-none" />
          </label>
        </div>
        <label htmlFor="email" className="flex flex-col items-start text-sm text-gray-400">
          Email address
          <input id="email" name="email" type="email" readOnly value={user.email ?? 'loading'} className="w-full pb-1 text-gray-800 text-lg border-b focus:outline-none" />
        </label>
      </div>

      <div className="flex justify-end gap-x-4 mt-10">
        <button type="button" className="text-gray-400 hover:text-gray-600" onClick={() => onClose()}>Cancel</button>

        <button
          type="button"
          onClick={() => {
            onSave()
              .then(() => {
                snackBar({ title: 'Success', message: 'The changes you requested have been made.' }, SnackBarType.Success);
                onClose();
              })
              .catch((error) => snackBar({ title: error.name, message: error.message }, SnackBarType.Error));
          }}
          className="px-5 py-2 bg-gray-600 hover:bg-gray-800 text-white rounded-full"
        >
          Save changes
        </button>
      </div>
    </>
  );
}

export default { EditUserDialog };
