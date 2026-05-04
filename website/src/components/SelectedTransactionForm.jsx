import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from 'react-router';

function SelectedTransactionForm({transaction, isPending, isError, onSubmit}) {
    const [formData, setFormData] = useState({
        name: transaction?.name || '',
        description: transaction?.description || '',
        amount: transaction?.amount || '',
        date: transaction?.date || '',
    });

    useEffect(() => {
        setFormData({
            name: transaction?.name || '',
            description: transaction?.description || '',
            amount: transaction?.amount || '',
            date: transaction?.date || '',
        });
    }, [transaction]);

  return (
    <div className="modal-overlay">
        <div className="modal" onClick={(e) => e.stopPropagation()}>
        <Link className="back" to="/transactions" onClick={() => setSelectedTransactionId(undefined)}>Back</Link>

        <h2>Transaction Details</h2>
        <form onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
        }}>
            <div className="form-group">
                <label>Name:</label>
                <input type="text" placeholder="Transaction Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="form-group">
                <label>Description:</label>
                <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
            </div>
            <div className="form-group">
                <label>Amount:</label>
                <input type="number" placeholder="Amount" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
            </div>
            <div className="form-group">
                <label>Date:</label>
                <input type="date" placeholder="Date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
            </div>
            {isError && <p className="error">Error updating transaction. Please try again.</p>}
            <button type="submit" disabled={isPending}>
                {isPending ? 'Updating...' : 'Update Transaction'}
            </button>
        </form>
        </div>
    </div>

  )
}

export default SelectedTransactionForm