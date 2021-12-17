import React, { useState } from 'react';
import Select from 'react-select';

import { Role, createUser } from '../../../../data';
import { useSnackBar, SnackBarType } from '../../../../utils/modals';

export function CreateUserDialog(props: {onClose: VoidFunction}) {
  const { onClose } = props;

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
  });

  const snackBar = useSnackBar();

  const options = [
    { value: 'annotator', label: 'Annotator' },
    { value: 'verifier', label: 'Verifier' },
  ];

  const handleSelectChange = (option: any) => {
    setFormData({ ...formData, role: option.value });
  };

  const handleInputChange = (event: any) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createUser(formData.name, formData.email, formData.role as Role)
      .catch((error) => snackBar({ title: error.name, message: error.message }, SnackBarType.Error));
  };

  return (
    <div className="max-w-md">
      <div className="mb-6 flex flex-col gap-y-1">
        <h1 className="text-xl font-medium">Add a new worker</h1>
        <p className="text-gray-400">Specify the name, email, and role of user that you want to invite into the application.</p>
      </div>

      <form onSubmit={handleFormSubmit} className="flex flex-col gap-y-4 px-2 my-10">
        <div className="flex justify-between gap-x-8">
          <label htmlFor="email" className="flex flex-col items-start text-sm text-gray-400">
            Full name
            <input id="email" name="email" type="email" value={formData.name} onChange={handleInputChange} className="pb-1 text-gray-800 text-lg border-b focus:outline-none focus:border-black" />
          </label>
          { /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }
          <label htmlFor="role" className="flex flex-col items-start justify-between text-sm text-gray-400">
            Role
            <Select name="role" onChange={handleSelectChange} options={options} />
          </label>
        </div>
        <label htmlFor="email" className="flex flex-col items-start text-sm text-gray-400">
          Email address
          <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full pb-1 text-gray-800 text-lg border-b focus:outline-none focus:border-black" />
        </label>
      </form>

      <div className="flex justify-end gap-x-4 mt-12">
        <button type="button" className="text-gray-400 hover:text-gray-600" onClick={() => onClose()}>Cancel</button>
        <button
          type="button"
          onClick={() => {
            onClose();
          }}
          className="px-5 py-2 bg-gray-600 hover:bg-gray-800 text-white rounded-full"
        >
          Create
        </button>
      </div>
    </div>
  );
}

export default { CreateUserDialog };
