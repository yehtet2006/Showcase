import React from 'react'


function DashboardPage() {

  return (
    <div>
        <h1>Dashboard</h1>
        <br />
        {isLoading && <p>Loading user data...</p>}
        {error && <p>Error loading user data: {error.message}</p>}
        {userMe && <p>Welcome, {userMe.email}!</p>}
        <br />
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magni earum modi necessitatibus molestias, laboriosam optio distinctio aspernatur dolorem reprehenderit delectus voluptates illum laborum ipsam a alias fugiat facere eum dolorum.</p>
    </div>
  )
}

export default DashboardPage