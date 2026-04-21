import { SignInButton, SignOutButton } from "@clerk/react"
import { UserProfile } from "@clerk/react"
import '../styles/profilePage.css'

function ProfilePage() {
  return (
    <div className="profile-page-container">
      
      <div className="userprofile-container">
        <UserProfile />
      </div>
      <SignOutButton className="sign-out-button" />
    </div>
  )
}

export default ProfilePage