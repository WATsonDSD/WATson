import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext, logout } from '../../../data';

export default function Dashboard() {
  const navigate = useNavigate();
  const userContext = useUserContext();

  if (userContext === 'isLoading') {
    return <span>Loading...</span>;
  }
  return (
    <div>
      Hi,
      {' '}
      {userContext ? userContext.name : 'You are a dumbo'}
      {' '}
      {/* {authentication.user.roles.indexOf('projectManager') !== -1 ? <span>You are an amazing manager!</span> : <span>You are no one...</span>}
      {' '} */}
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
