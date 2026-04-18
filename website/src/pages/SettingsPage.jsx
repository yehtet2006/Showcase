
import {useUser, useUsers} from '../hooks/useUsers';
import { useAuth } from '@clerk/react';
import UsersInfoCard from "../components/UsersInfoCard";


function SettingsPage() {
 
  const {userId} = useAuth();

  const { data: users, isLoading, error } = useUsers(); // Fetch all users for admin view
  const { data: currentUser } = useUser(userId); // Fetch current user data to check role and display info

  // Debugging logs, remove in production
  console.log("userId:", userId);
  console.log("currentUser:", currentUser);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading users: {error.message}</div>;
  }

  return (
    <div>
      <h1>Settings Page for {currentUser?.name}</h1>
      
        <UsersInfoCard />
    </div>
  );
}

export default SettingsPage;