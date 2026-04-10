import { useAuth } from "@clerk/react"
import { useUser } from "../hooks/useUsers";


function DashboardPage() {
  const {userId} = useAuth();

  const { data: currentUser } = useUser(userId);
  return (
    <div>
        <h1>Welkom: {currentUser?.name}</h1>
        <br />
        <br />
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magni earum modi necessitatibus molestias, laboriosam optio distinctio aspernatur dolorem reprehenderit delectus voluptates illum laborum ipsam a alias fugiat facere eum dolorum.</p>
    </div>
  )
}

export default DashboardPage