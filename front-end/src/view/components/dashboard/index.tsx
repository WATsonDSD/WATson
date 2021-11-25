import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../utils/auth';

export default function Dashboard() {
  const navigate = useNavigate();
  const auth = useAuth();
  return (
    <div>
      Hi,
      {' '}
      {auth.user.name}
      !
      {' '}
      <button
        type="button"
        onClick={() => {
          auth.logout(() => navigate('/'));
        }}
      >
        Logout!
      </button>
    </div>
  );
}
