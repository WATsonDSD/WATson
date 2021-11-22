import React from 'react';
import logo from '../../logo.svg';

export default function Authentication() {
  return (
    <div>
      <div className="flex flex-col items-start w-1/3 h-screen p-16">
        <img src={logo} alt="Logo" />
        <h2 className="font-bold text-3xl">Sign in</h2>
        <h2 className="text-3xl">with your credentials</h2>
        <form>
          <label htmlFor="email" className="flex flex-col items-start text-gray-500">
            Email
            <input id="email" name="email" type="email" autoComplete="email" required className="text-black" />
          </label>
          <label htmlFor="password" className="flex flex-col items-start text-gray-500">
            Password
            <input id="password" name="password" type="password" autoComplete="current-password" required className="text-black" />
          </label>
        </form>
      </div>
      <div className="media" />
    </div>
  );
}
