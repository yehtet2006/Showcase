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
          <label>Naam:</label>
          <input type="text" placeholder="Username" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>E-mail:</label>
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required /> <br />
        </div>
        <div className="form-group">
          <label>Rol:</label>
          <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
            <option value="user">Gebruiker</option>
            <option value="admin">Beheerder</option>
        </select>
        </div>
        {isError && <p className="error">Error updating user. Please try again.</p>}
        <button type="submit" disabled={isPending}>
          {isPending ? 'Bijwerken...' : 'Gebruiker bijwerken'}
        </button>
      </form>
      </div>
    </div>
  )
}

export default SelectedUserForm