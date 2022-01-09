import React, { useRef } from 'react';

import { addBonus, Worker } from '../../../../data';
import { useSnackBar, SnackBarType } from '../../../../utils/modals';

export function AwardBonusDialog(props: {onClose: VoidFunction, user: Worker}) {
  const { onClose, user } = props;

  const bonus = useRef<HTMLInputElement>(null);
  const snackBar = useSnackBar();

  async function onSave() {
    addBonus(user, Number(bonus.current?.value));
    console.log(user);
  }

  return (
    <>
      <h1 className="text-xl font-medium mb-4">Choose the bonus amount</h1>

      <div id="award-bonus" className="mt-2">
        <input id="bonus" name="bonus" type="number" min={0} ref={bonus} placeholder="0" className="w-full pb-1 text-gray-800 text-lg border-b focus:outline-none" />
      </div>

      <div className="flex justify-end gap-x-4 mt-10">
        <button type="button" className="text-gray-400 hover:text-gray-600" onClick={() => onClose()}>Cancel</button>

        <button
          type="button"
          onClick={() => {
            onSave()
              .then(() => snackBar({ title: '', message: '' }, SnackBarType.Success))
              .catch((error) => snackBar({ title: error.name, message: error.message }, SnackBarType.Error));
          }}
          className="px-5 py-2 bg-gray-600 hover:bg-gray-800 text-white rounded-full"
        >
          Award Bonus
        </button>
      </div>
    </>
  );
}

export default { AwardBonusDialog };
