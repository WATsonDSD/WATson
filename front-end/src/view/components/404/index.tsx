import React from 'react';

import { useNavigate, Link } from 'react-router-dom';

import { Paths } from '../shared/routes/paths';

import logo from '../../logo.svg';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div id="not-found" className="flex justify-between px-24 py-20">
      <div className="w-full">
        <Link to={Paths.Projects}>
          <img src={logo} alt="Logo" />
        </Link>
        <div className="flex flex-col mt-64">
          <span className="text-8xl">404</span>
          <span className="text-xl font-medium">Something went wrong, we couldn&apos;t find the page you were looking for :(</span>
        </div>
        <button type="button" onClick={() => navigate(Paths.Projects)} className="max-w-content mt-10 px-6 py-2 border border-gray-800 rounded-full">
          Back to home
        </button>
      </div>
      <div className="flex justify-end items-center w-full pr-16" />
    </div>
  );
}
