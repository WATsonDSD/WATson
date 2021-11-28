import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext, logout } from '../../../data';

export default function Dashboard() {
  const navigate = useNavigate();
  const userContext = useUserContext();

  if (userContext === 'isLoading') {
    return <span>Loading....</span>;
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          logout().then(() => navigate('/'));
        }}
      >
        LOGOUT!
      </button>
    </div>
  );
}
