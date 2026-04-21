import { SignIn } from "@clerk/react"
import '../styles/signIn.css'


function SignInPage() {
  


  return (
    <div>
      <h1>Sign In</h1>
      <div className="signIn">
        <SignIn afterSignInUrl="/dashboard" />
      </div>
      
    </div>
  )
}

export default SignInPage