import React, { useState } from 'react';
import Select from 'react-select';

import { Role, createUser } from '../../../../data';
import { useSnackBar, SnackBarType } from '../../../../utils/modals';

export function CreateUserDialog(props: {onClose: VoidFunction}) {
  const { onClose } = props;

  const [formData, setFormData] = useState({
    fullname: '',
    role: '',
    email: '',
  });

  const snackBar = useSnackBar();

  const options = [
    { value: 'annotator', label: 'Annotator' },
    { value: 'verifier', label: 'Verifier' },
  ];

  const SelectStyles = {
    control: (provided: any) => ({
      // none of react-select's styles are passed to <Control />
      ...provided,
      minHeight: 0,
      border: 0,
      borderRadius: 0,
      borderBottom: '1px solid rgb(229, 231, 235)',
      boxShadow: 'none',
      '&:focus': {
        borderBottom: '1px solid black',
      },
      '&:hover': {
        borderBottom: '1px solid black',
      },
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: 0,
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      color: state.isSelected ? 'black' : 'rgba(0, 0, 0, 0.4)',
      backgroundColor: 'white',
      '&:hover': {
        color: 'black',
      },
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      padding: 0,
    }),
    input: (provided: any) => ({
      ...provided,
      padding: 0,
    }),
    indicatorSeparator: () => ({}),

  };

  const handleSelectChange = (option: any) => {
    setFormData({ ...formData, role: option.value });
  };

  const handleInputChange = (event: any) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createUser(formData.fullname, formData.email, formData.role as Role)
      .then(() => {
        onClose();
        snackBar({
          title: 'Success',
          message: 'The worker was successfully invited.',
        }, SnackBarType.Success);
      })
      .catch((error) => snackBar({
        title: error.name,
        message: error.message,
      }, SnackBarType.Error));
  };

  return (
    <div className="max-w-md">
      <div className="mb-6 flex flex-col gap-y-2">
        <h1 className="text-xl font-medium">Add a new worker</h1>
        <p className="text-gray-400">Specify the name, email, and role of user that you want to invite into the application.</p>
      </div>

      <form onSubmit={handleFormSubmit} className="flex flex-col gap-y-4 px-2">
        <div className="grid grid-cols-5 gap-4">
          <label htmlFor="fullname" className="flex flex-col items-start col-span-3 text-sm text-gray-400">
            Full name
            <input id="fullname" name="fullname" type="text" value={formData.fullname} onChange={handleInputChange} className="w-full pb-1 text-gray-800 text-base border-b focus:outline-none focus:border-black" />
          </label>
          { /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }
          <label htmlFor="role" className="flex flex-col items-start justify-between col-span-2 text-sm text-gray-400">
            Role
            <Select name="role" onChange={handleSelectChange} styles={SelectStyles} options={options} className="w-full text-base" />
          </label>
        </div>
        <label htmlFor="email" className="flex flex-col items-start text-sm text-gray-400">
          Email address
          <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full pb-1 text-gray-800 text-base border-b focus:outline-none focus:border-black" />
        </label>
        <div className="flex justify-end gap-x-4 mt-6">
          <button type="button" className="text-gray-400 hover:text-gray-600" onClick={() => onClose()}>Cancel</button>
          <button
            type="submit"
            className="px-5 py-2 bg-gray-600 hover:bg-gray-800 text-white rounded-full"
          >
            Create
          </button>
        </div>
      </form>

    </div>
  );
}

export default { CreateUserDialog };
