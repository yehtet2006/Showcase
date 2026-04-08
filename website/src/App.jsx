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


function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<SignInPage />} />
        <Route path='/signUp' element={<SignUpPage />} />
      </Routes>
      <Navbar />
      <main>
        <Routes>
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/transactions' element={<TransactionsPage />} />
          <Route path='/analytics' element={<AnalyticsPage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/settings' element={<SettingsPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App