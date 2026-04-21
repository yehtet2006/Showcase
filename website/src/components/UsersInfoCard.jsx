import { useState, useEffect } from 'react';
import {useUser, useUsers, useUpdateUser} from '../hooks/useUsers';
import { useAuth } from '@clerk/react';
import '../styles/settingsPage.css';
import { useParams, useNavigate, Link } from 'react-router';
import SelectedUserForm from './SelectedUserForm';

function UsersInfoCard() {

    const {data: users, isLoading, error } = useUsers(); // Fetch all users for admin view
    const { userId } = useParams();
    const navigate = useNavigate();
    const [selectedUserId, setSelectedUserId] = useState();
    const { data: selectedUser } = useUser(selectedUserId); // Get current user info
    const updateUserMutation = useUpdateUser();


    if (isLoading) {
        return <div className='loading'>Loading...</div>;
    }
    if (error ) {
        return <div className='error'>Error loading users: {error.message}</div>;
    }

  return (
    <div className='users-info-card'>
        <h2 className='text'>All Users:</h2>
        <div className='header'>
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Actions</span>
        </div>
        <div>
            <ul className='user-list-container'>
            {users && users.length > 0 ? (
                users.map((user) => (
                <li className='user-list' key={user.id}>
                    <span>{user.name}</span>
                    <span>{user.email}</span>
                    <span className={`role ${user.role}`}>
                        {user.role.toUpperCase()}
                    </span>
                    <button className='edit-btn' onClick={() => setSelectedUserId(user.id)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 20H21" stroke="#00A6FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M16.5 3.50001C16.8978 3.10219 17.4374 2.87869 18 2.87869C18.2786 2.87869 18.5544 2.93356 18.8118 3.04017C19.0692 3.14677 19.303 3.30303 19.5 3.50001C19.697 3.697 19.8532 3.93085 19.9598 4.18822C20.0665 4.44559 20.1213 4.72144 20.1213 5.00001C20.1213 5.27859 20.0665 5.55444 19.9598 5.81181C19.8532 6.06918 19.697 6.30303 19.5 6.50001L7 19L3 20L4 16L16.5 3.50001Z" stroke="#00A6FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>

                    </button>
                </li>
                
                ))
            ) : (
                <li className='text'>No users found.</li>
            )}
            </ul>
        </div>
        {selectedUser && (
            <SelectedUserForm 
                user={selectedUser} 
                isPending={updateUserMutation.isPending} 
                isError={updateUserMutation.isError} 
                onSubmit={(formData) => {
                    updateUserMutation.mutate({ id: selectedUserId, ...formData }, {
                        onSuccess: (updatedUser) => {
                            setSelectedUserId(undefined);

                            queryClient.invalidateQueries(['users']);
                            queryClient.invalidateQueries(['user', updatedUser.id]);

                            navigate('/settings');
                        }
                    });
                }} />
        )}
    </div>
  )
}

export default UsersInfoCard