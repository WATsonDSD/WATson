import React, { useState } from 'react';
import logo from '../../logo.svg';
import rightArrow from '../../../assets/icons/right-arrow.svg';

import * as auth from '../../../data/authenticator';

export default function Authentication() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    auth.login(email, password);
  };

  return (
    <div className="flex box-content">
      <div className="flex flex-col items-start w-2/5 h-screen p-24">
        <img src={logo} alt="Logo" />
        <h2 className="font-bold text-3xl mt-36">Sign in</h2>
        <h2 className="text-3xl mb-16">with your credentials</h2>
        <form onSubmit={handleSubmit} className="w-full">
          <label htmlFor="email" className="flex flex-col items-start text-gray-500 mb-8">
            Email
            <input id="email" name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full py-1 text-black text-lg border-b focus:outline-none" />
          </label>
          <label htmlFor="password" className="flex flex-col items-start text-gray-500">
            Password
            <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full py-2 text-black text-xs tracking-widest border-b focus:outline-none" />
          </label>
          <div className="flex items-center justify-end mt-16">
            <span className="text-gray-400 mr-5">Sign in</span>
            <button type="submit" className="disabled:bg-grey-400 flex justify-center bg-black w-16 h-16 rounded-full">
              <img src={rightArrow} alt="Submit" className="w-1/3" />
            </button>
          </div>
        </form>
      </div>
      <div className="box-border w-full bg-blue-50 my-12 mr-12" />
    </div>
  );
}
