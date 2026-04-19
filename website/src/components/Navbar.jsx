import { NavLink, Link } from "react-router"
import { useState } from "react"
import { useAuth } from "@clerk/react"
import { useUser } from "../hooks/useUsers"
import { UserAvatar } from "@clerk/react"

function Navbar() {
  const [collapsed, setCollapsed] = useState(false)
  const {userId} = useAuth();
  const { data: currentUser } = useUser(userId);
  console.log("Current user in Navbar:", currentUser);
  return (
    <>
      <nav className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <ul>
          <li>
            <span className="logo">{!collapsed && "Spendly"}</span>
            <button onClick={() => setCollapsed(!collapsed)} id="collapse-btn">
              {!collapsed ? (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-240 200-480l240-240 56 56-183 184 183 184-56 56Zm264 0L464-480l240-240 56 56-183 184 183 184-56 56Z"/></svg>)
               : 
               (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M383-480 200-664l56-56 240 240-240 240-56-56 183-184Zm264 0L464-664l56-56 240 240-240 240-56-56 183-184Z"/></svg>)}
            </button>
          </li>
          <li className="nav-item">
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z"/></svg>
            {!collapsed && <span>Dashboard</span>}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/transactions" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M240-80q-50 0-85-35t-35-85v-120h120v-560h600v680q0 50-35 85t-85 35H240Zm480-80q17 0 28.5-11.5T760-200v-600H320v480h360v120q0 17 11.5 28.5T720-160ZM360-600v-80h360v80H360Zm0 120v-8₀h36₀v8₀H36₀ZM24₀-16₀h36₀v-8₀H2₀₀v4₀q₀ 17 1₁.₅ 28.5T24₀-16₀Zm₀ ₀h-4₀ 4₀₀-3₆₀Z"/></svg>
              {!collapsed && <span>Transactions</span>}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/analytics" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-120q-33 0-56.5-23.5T120-200v-640h80v640h640v80H200Zm40-120v-360h160v360H240Zm200 0v-560h160v560H440Zm200 0v-200h160v200H640Z"/></svg>
              {!collapsed && <span>Analytics</span>}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <UserAvatar />
              {!collapsed && <span>Profile</span>}
            </NavLink>
          </li>
          {currentUser?.role === "admin" && (
          <li className="nav-item">
            <NavLink to='/settings' className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>
              {!collapsed && <span>Settings</span>}
            </NavLink>
          </li>)}
        </ul>
      </nav>
    </>
  )
}

export default Navbar