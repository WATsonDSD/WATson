import React, { useState } from 'react';
import logo from '../../logo.svg';
import { logIn } from '../../../data/authenticator';

export default function Authentication() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    logIn(email, password);
  };

  return (
    <div>
      <div className="flex flex-col items-start w-1/3 h-screen p-16">
        <img src={logo} alt="Logo" />
        <h2 className="font-bold text-3xl">Sign in</h2>
        <h2 className="text-3xl">with your credentials</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="flex flex-col items-start text-gray-500">
            Email
            <input id="email" name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="text-black" />
          </label>
          <label htmlFor="password" className="flex flex-col items-start text-gray-500">
            Password
            <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="text-black" />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
      <div className="media" />
    </div>
  );
}
