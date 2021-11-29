import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext, logOut } from '../../../data';

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
          logOut().then(() => navigate('/'));
        }}
      >
        LOGOUT!
      </button>
    </div>
  );
}
