import { SignInButton, SignOutButton } from "@clerk/react"

function ProfilePage() {
  return (
    <>
      <h1>Profile Page</h1>
      <SignInButton />
      <SignOutButton />
    </>
  )
}

export default ProfilePage