import { Route, Routes } from 'react-router'
import './index.css'
import Navbar from './components/Navbar'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import useAuthReq from './hooks/useAuthReq'
import useUserSync from './hooks/useUserSync'



function App() {
  const { isSignedIn, isClerkLoaded } = useAuthReq();
  useUserSync();
  console.log('App rendered, isClerkLoaded:', isClerkLoaded, 'isSignedIn:', isSignedIn)
  if(!isClerkLoaded) return null;

  if (!isClerkLoaded) {
    return <div>Loading...</div>;
  }
  return (
    <>
      {isSignedIn && <Navbar />}
      <main>
        <Routes>
          <Route path='/' element={!isSignedIn && <SignInPage />} />
          <Route path='/signUp' element={!isSignedIn && <SignUpPage />} />
          <Route path='/dashboard' element={isSignedIn && <DashboardPage />} />
          <Route path='/transactions' element={isSignedIn && <TransactionsPage />} />
          <Route path='/analytics' element={isSignedIn && <AnalyticsPage />} />
          <Route path='/profile' element={isSignedIn && <ProfilePage />} />
          <Route path='/settings' element={isSignedIn && <SettingsPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App