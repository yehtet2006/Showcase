import { Route, Routes, Navigate } from 'react-router'
import './index.css'
import Navbar from './components/Navbar'
import SignInPage from './pages/SignInPage'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import AllTransactionsPage from './pages/AllTransactionsPage'
import useAuthReq from './hooks/useAuthReq'
import useUserSync from './hooks/useUserSync'
import { useUser } from './hooks/useUsers'
import { useAuth } from '@clerk/react'



function App() {
  const {userId} = useAuth();

  const { data: currentUser } = useUser(userId);

  const { isSignedIn, isClerkLoaded } = useAuthReq();
  useUserSync();
  if(!isClerkLoaded) return null;

  if (!isClerkLoaded) {
    return <div>Loading...</div>;
  }
  return (
    <>
      {isSignedIn && <Navbar />}
      <main className='all-content-container'>
        <Routes>

            <Route path="/" element={isSignedIn ? <DashboardPage /> : <Navigate to="/signin" replace />}/>
            <Route path="/signin" element={isSignedIn ? <Navigate to="/" replace /> : <SignInPage />}/>
            <Route path="/transactions/add" element={isSignedIn ? <TransactionsPage /> : <Navigate to="/signin" replace />}/>
            <Route path="/transactions" element={isSignedIn ? <AllTransactionsPage /> : <Navigate to="/signin" replace />}/>
            <Route path="/analytics" element={isSignedIn ? <AnalyticsPage /> : <Navigate to="/signin" replace />}/>
            <Route path="/profile" element={isSignedIn ? <ProfilePage /> : <Navigate to="/signin" replace /> }/>
            <Route path="/settings" element={currentUser?.role === 'admin' && isSignedIn ? <SettingsPage /> : <Navigate to="/" replace />}/>
        </Routes>
      </main>
    </>
  )
}

export default App