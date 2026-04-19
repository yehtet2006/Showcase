
import {useUser, useUsers} from '../hooks/useUsers';
import { useAuth } from '@clerk/react';
import UsersInfoCard from "../components/UsersInfoCard";
import '../styles/settingsPage.css';

function SettingsPage() {
  const {userId} = useAuth();
  const { data: currentUser } = useUser(userId); // Get current user info
  console.log('Current User In settings pages:', currentUser); // Debugging log
  return (
    <div>
      <h1>Settings Page for {currentUser?.name}</h1>
        <UsersInfoCard />
    </div>
  );
}
export default SettingsPage;