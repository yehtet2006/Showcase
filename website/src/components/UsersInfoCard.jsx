import { use } from 'react';
import {useUser, useUsers} from '../hooks/useUsers';
import { useAuth } from '@clerk/react';

function UsersInfoCard() {

    const {data: users, isLoading, error } = useUsers(); // Fetch all users for admin view
    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error loading users: {error.message}</div>;
    }
  return (
    <div>
        <h2>All Users:</h2>
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
                    {user.role ==='admin' ? 
                        <span className='admin'>{user.role}</span>
                        : 
                        <span className='user'>{user.role}</span>
                    }
                    <button className='edit-btn' onClick={() => console.log(user.id)}>Edit</button>
                </li>
                
                ))
            ) : (
                <li>No users found.</li>
            )}
            </ul>
            </div>
        </div>
  )
}

export default UsersInfoCard