import { Route, Routes } from 'react-router'
import './index.css'
import Navbar from './components/Navbar'
import SignInPage from './pages/SignInPage'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
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
      <main>
        <Routes>
          <Route path="/"element={isSignedIn ? <DashboardPage /> : <SignInPage />} />
          <Route path="/dashboard"element={isSignedIn ? <DashboardPage /> : <SignInPage />} />
          <Route path='/transactions' element={isSignedIn && <TransactionsPage />} />
          <Route path='/analytics' element={isSignedIn && <AnalyticsPage />} />
          <Route path='/profile' element={isSignedIn && <ProfilePage />} />
          <Route path='/settings' element={currentUser?.role === "admin" && isSignedIn && <SettingsPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App