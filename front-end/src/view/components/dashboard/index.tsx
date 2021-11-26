import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthentication from '../../../data/authentication';

export default function Dashboard() {
  const navigate = useNavigate();
  const authentication = useAuthentication();

  return (
    <div>
      Hi,
      {' '}
      {authentication.user.name}
      {' '}
      {authentication.user.roles.indexOf('projectManager') !== -1 ? <span>You are an amazing manager!</span> : <span>You are no one...</span>}
      {' '}
      <button
        type="button"
        onClick={() => {
          authentication.logout(() => navigate('/'));
        }}
      >
        LOGOUT!
      </button>
    </div>
  );
}
