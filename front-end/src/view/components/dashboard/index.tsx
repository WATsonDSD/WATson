import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthentication from '../../../data/authentication';

export default function Dashboard() {
  const navigate = useNavigate();
  const authentication = useAuthentication();
  return (
    <div>
      Hi!
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
