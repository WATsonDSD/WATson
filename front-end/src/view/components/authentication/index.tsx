import React, { useState } from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import { Paths } from '../shared/routes';
import { logIn, useUserData } from '../../../data';
import { useSnackBar, SnackBarType } from '../../../utils/modals';

import logo from '../../logo.svg';
import rightArrow from '../../../assets/icons/right-arrow.svg';

import Loading from '../loading';

export default function Authentication() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [user, sessionState] = useUserData();

  const navigate = useNavigate();

  const snackBar = useSnackBar();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    logIn(formData.email, formData.password)
      .catch((error) => snackBar({ title: error.name, message: error.message }, SnackBarType.Error));
  };

  // Show the loading page while we fetch the user data
  if (sessionState === 'pending') {
    return <Loading />;
  }

  /**
   * Redirects the user if he is already authenticated.
   */
  if (user && sessionState === 'authenticated') {
    navigate(Paths.Projects, { replace: true });
  }

  return (
    <div className="flex w-full">
      <div className="flex flex-col items-start gap-y-28 w-2/5 min-w-500 h-screen p-20">
        <img src={logo} alt="Logo" />
        <hgroup className="flex flex-col items-start">
          <h2 className="font-bold text-3xl">Sign in</h2>
          <h2 className="text-3xl">with your credentials</h2>
        </hgroup>
        <form onSubmit={handleFormSubmit} className="w-full flex flex-col gap-y-8">
          <label htmlFor="email" className="flex flex-col items-start text-gray-500">
            Email
            <input id="email" name="email" type="email" autoComplete="email" value={formData.email} onChange={handleInputChange} required className="w-full py-1 text-black text-lg border-b focus:outline-none focus:border-black" />
          </label>
          <label htmlFor="password" className="flex flex-col items-start text-gray-500">
            Password
            <input id="password" name="password" type="password" autoComplete="current-password" required value={formData.password} onChange={handleInputChange} className="w-full py-2 text-black text-xs tracking-widest border-b focus:outline-none focus:border-black" />
          </label>
          <div className="flex items-center justify-end mt-4">
            <button type="submit" className="flex justify-center items-center gap-x-4 px-6 py-3 bg-gray-800 hover:bg-black text-white transition-all rounded-full">
              Sign in
              <img src={rightArrow} alt="Submit" />
            </button>
          </div>
        </form>
      </div>
      <div className="box-border w-full bg-blue-50 my-12 mr-12" />
    </div>
  );
}
