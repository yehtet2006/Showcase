import { useState } from "react"
import { useParams, useNavigate, Link } from 'react-router';


function SelectedUserForm({user, isPending, isError, onSubmit}) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role,
  });


  return (
    <div className="modal-overlay">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
      <Link className="back" to="/settings" onClick={() => setSelectedUserId(undefined)}>Back</Link>
      
      <h2>User Details</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" placeholder="Username" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required /> <br />
        </div>
        <div className="form-group">
          <label>Role:</label>
          <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
        </select>
        </div>
        {isError && <p className="error">Error updating user. Please try again.</p>}
        <button type="submit" disabled={isPending}>
          {isPending ? 'Updating...' : 'Update User'}
        </button>
      </form>
      </div>
    </div>
  )
}

export default SelectedUserForm