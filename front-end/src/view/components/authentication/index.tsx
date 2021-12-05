import React, { useEffect, useState } from 'react';

import {
  useNavigate,
  useLocation,
} from 'react-router-dom';

import { logIn, useUserContext } from '../../../data';

import logo from '../../logo.svg';
import rightArrow from '../../../assets/icons/right-arrow.svg';

export default function Authentication() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const loggedInUser = useUserContext();

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    logIn(formData.email, formData.password).then(() => {
      // Sends the user back to the page they tried to visit when they were
      // redirected to the login page. { replace: true } is used to remove the
      // login page from the navigation stack. This prevents the user to navigate
      // back to the login page with the back button.
      navigate(from, { replace: true });
    });
  };

  useEffect(() => {
    if (loggedInUser && loggedInUser !== 'isLoading') { navigate(from, { replace: true }); }
  });

  return (
    <div className="flex w-full">
      <div className="flex flex-col items-start gap-y-28 w-2/5 min-w-500 h-screen p-20">
        <img src={logo} alt="Logo" />
        <hgroup className="flex flex-col items-start">
          <h2 className="font-bold text-3xl">Sign in</h2>
          <h2 className="text-3xl">with your credentials</h2>
        </hgroup>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-y-8">
          <label htmlFor="email" className="flex flex-col items-start text-gray-500">
            Email
            <input id="email" name="email" type="email" autoComplete="email" value={formData.email} onChange={handleChange} required className="w-full py-1 text-black text-lg border-b focus:outline-none focus:border-black" />
          </label>
          <label htmlFor="password" className="flex flex-col items-start text-gray-500">
            Password
            <input id="password" name="password" type="password" autoComplete="current-password" required value={formData.password} onChange={handleChange} className="w-full py-2 text-black text-xs tracking-widest border-b focus:outline-none focus:border-black" />
          </label>
          <div className="flex items-center justify-end">
            <span className="text-gray-400 mr-5">Sign in</span>
            <button type="submit" className="hover:bg-black flex justify-center items-center bg-gray-700 w-16 h-16 rounded-full">
              <img src={rightArrow} alt="Submit" className="w-1/3" />
            </button>
          </div>
        </form>
      </div>
      <div className="box-border w-full bg-blue-50 my-12 mr-12" />
    </div>
  );
}
