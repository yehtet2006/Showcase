import React from 'react'
import {useUser, useUsers} from '../hooks/useUsers';
import { useAuth } from '@clerk/react';


function SettingsPage() {

  const {userId} = useAuth(); // 👈 replace with real ID

  const { data: users, isLoading, error } = useUsers();
  const { data: userMe } = useUser(userId);
  console.log("userId:", userId);
  console.log("userMe:", userMe);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading users: {error.message}</div>;
  }

  return (
    <div>
      <h1>Settings Page for {userMe?.email}</h1>

      <h2>All Users:</h2>
      <ul>
        {users && users.length > 0 ? (
          users.map((user) => (
            <li key={user.id}>
              {user.name} ({user.email}) - Role: {user.role}
            </li>
          ))`s`
        ) : (
          <li>No users found.</li>
        )}
      </ul>
    </div>
  );
}

export default SettingsPage;