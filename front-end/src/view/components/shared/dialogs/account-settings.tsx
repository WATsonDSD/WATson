import React, { useRef, useState } from 'react';

import { UpdateUserError } from '../../../../utils/errors';
import { useUserNotNull, changePassword } from '../../../../data';

import CloseIcon from '../../../../assets/icons/close.svg';
import { useSnackBar, SnackBarType } from '../../../../utils/modals';

export function AccountSettings(props: {onClose: VoidFunction}) {
  const { onClose } = props;

  const [user] = useUserNotNull();

  const [selectedTab, setSelectedTab] = useState(0);

  const password = useRef<HTMLInputElement>(null);
  const repeatPassword = useRef<HTMLInputElement>(null);

  const snackBar = useSnackBar();

  const SecurityTab = () => (
    <section>
      <h1 className="text-lg font-medium mb-4">Set a new password</h1>
      <div className="flex gap-x-6">
        <label htmlFor="password" className="flex flex-col items-start w-full text-gray-500">
          Password
          <input id="password" name="password" type="password" ref={password} required className="w-full py-2 text-black text-xs tracking-widest border-b focus:outline-none focus:border-black" />
        </label>
        <label htmlFor="repeat-password" className="flex flex-col items-start w-full text-gray-500">
          Repeat password
          <input id="repeat-password" name="repeat-password" type="password" ref={repeatPassword} required className="w-full py-2 text-black text-xs tracking-widest border-b focus:outline-none focus:border-black" />
        </label>
      </div>
    </section>
  );

  const tabs : {[name: string] : {content: JSX.Element, onSave: () => Promise<void>}} = {
    security: {
      content: <SecurityTab />,
      onSave: async () => {
        if (password?.current?.value !== repeatPassword?.current?.value) throw new UpdateUserError();

        changePassword(user.email, password!.current!.value);
      },
    },
  };

  return (
    <div>
      <div className="w-full flex items-center justify-between mb-4">
        <h1 className="text-xl font-medium">Account Settings</h1>
        <button
          type="button"
          onClick={() => onClose()}
        >
          <img src={CloseIcon} alt="Close Dialog" />
        </button>
      </div>

      <div>
        <div className="flex items-start gap-x-4 border-b">
          {Object.entries(tabs).map((tab, index) => (
            <button type="button" key={tab[0]} className={`${selectedTab === index ? 'text-black border-black' : 'text-gray-400 border-white'} capitalize pb-2 border-b-2 transition-all`} onClick={() => setSelectedTab(index)}>{tab[0]}</button>
          ))}
        </div>

        <div id="account-settings" className="flex flex-col justify-between h-96 mt-6">
          {Object.values(tabs)[selectedTab].content}

          <div className="flex justify-end gap-x-4">
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
                Object.values(tabs)[selectedTab].onSave()
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
        </div>
      </div>
    </div>
  );
}

export default { AccountSettings };
