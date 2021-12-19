import React from 'react';

import { useUserNotNull } from '../../../../data';

export function EditProfileDialog(props: {onClose: VoidFunction}) {
  const { onClose } = props;

  const [user] = useUserNotNull();

  return (
    <>
      <h1 className="text-xl font-medium mb-4">Edit your profile</h1>

      <div className="flex items-center gap-x-6 px-6 py-4 border rounded-md">
        <span className="block w-24 h-24 bg-blue-100 rounded-full" />
        <div className="flex flex-col gap-y-2">
          <div className="flex gap-x-2">
            <button type="button" className="px-8 py-1 text-gray-800 hover:text-black border hover:bg-gray-50 rounded-full">Upload a new photo</button>
            <button type="button" className="px-8 py-1 text-red-600 hover:text-red-800 border border-red-100 hover:bg-red-50 rounded-full">Remove</button>
          </div>
          <p className="text-gray-400 text-sm text-center">Limit the size of your profile picture.</p>
        </div>
      </div>

      <div className="px-2 mt-8 flex flex-col gap-y-6">
        <div className="flex justify-between">
          <label htmlFor="email" className="flex flex-col items-start text-sm text-gray-400">
            Full name
            <input id="email" name="email" type="email" readOnly value={user.name ?? 'loading'} className="pb-1 text-gray-800 text-lg border-b focus:outline-none" />
          </label>
          <label htmlFor="role" className="flex flex-col items-start text-sm text-gray-400">
            Role
            <input id="role" name="role" type="text" readOnly value={user.role ?? 'loading'} className="pb-1 text-gray-800 text-lg border-b focus:outline-none" />
          </label>
        </div>
        <label htmlFor="email" className="flex flex-col items-start text-sm text-gray-400">
          Email address
          <input id="email" name="email" type="email" readOnly value={user.email ?? 'loading'} className="w-full pb-1 text-gray-800 text-lg border-b focus:outline-none" />
        </label>
      </div>

      <div className="flex justify-end gap-x-4 mt-10">
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600"
          onClick={() => onClose()}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            onClose();
          }}
          className="px-5 py-2 bg-gray-600 hover:bg-gray-800 text-white rounded-full"
        >
          Save changes
        </button>
      </div>
    </>
  );
}

export default { SignOutDialog: EditProfileDialog };
