import React from 'react';
import { useAuth } from '../../../utils/auth';

export default function Dashboard() {
  const auth = useAuth();
  return (
    <div>
      Hi,
      {' '}
      {auth.user.email}
      !
    </div>
  );
}
