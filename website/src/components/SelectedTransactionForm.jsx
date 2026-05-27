import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from 'react-router';
import { useCategories } from "../hooks/useCategories";
import { useDeleteTransaction } from "../hooks/useTransactions";
import { useQueryClient } from "@tanstack/react-query";

function SelectedTransactionForm({transaction, isPending, isError, onSubmit, onClose}) {
    const { data: categories} = useCategories();
    const deleteTransactionMutation = useDeleteTransaction();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: transaction?.name || '',
        description: transaction?.description || '',
        amount: transaction?.amount || '',
        date: transaction?.date ? new Date(transaction.date).toISOString().split('T')[0] : '',
        categoryId : transaction?.categoryId || '',
        type: transaction?.type || '',
    });

    useEffect(() => {
        setFormData({
            name: transaction?.name || '',
            description: transaction?.description || '',
            amount: transaction?.amount || '',
            date: transaction?.date ? new Date(transaction.date).toISOString().split('T')[0] : '',
            categoryId: transaction?.categoryId || '',
            type: transaction?.type || '',
        });
    }, [transaction]);

  return (
    <div className="modal-overlay">
        <div className="modal" onClick={(e) => e.stopPropagation()}>
        <Link className="back" to="/transactions" onClick={onClose}>Back</Link>

        <h2>Transaction Details</h2>
        <form onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
                ...formData,
                categoryId: formData.categoryId || null,
        });
        }}>
            <div className="form-group">
                <label>Naam:</label>
                <input type="text" placeholder="Transaction Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="form-group">
                <label>Beschrijving:</label>
                <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="form-group">
                <label>Bedrag:</label>
                <input type="number" placeholder="Amount" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
            </div>
            <div className="form-group">
                <label>Datum:</label>
                <input type="date" placeholder="Date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
            </div>
            <div className="form-group-select">
                <label>Categorie:</label>
                <select value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})}>
                    <option value="">Kies een categorie</option>
                    {categories && categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </div>
            <div className="form-group-select">
                <label>Type:</label>

                <div className="type-toggle">
                <button
                    type="button"
                    className={formData.type === "income" ? "active income-btn" : ""}
                    onClick={() => setFormData({ ...formData, type: "income" })}
                >
                    Inkomen
                </button>

                <button
                    type="button"
                    className={formData.type === "expense" ? "active expense-btn" : ""}
                    onClick={() => setFormData({ ...formData, type: "expense" })}
                >
                    Uitgave
                </button>

                <button
                    type="button"
                    className={formData.type === "savings" ? "active savings-btn" : ""}
                    onClick={() => setFormData({ ...formData, type: "savings" })}
                >
                    Sparen
                </button>
                </div>
            </div>
            {isError && <p className="error">Error updating transaction. Please try again.</p>}
            <button type="submit" disabled={isPending}>
                {isPending ? 'Bijwerken...' : 'Transactie bijwerken'}
            </button>
            <button type="button" id="dlt-btn" onClick={() => {
                if (window.confirm('Weet je zeker dat je deze transactie wilt verwijderen?')) {
                    deleteTransactionMutation.mutate(transaction.id, {  // transaction.id not selectedTransaction.id
                        onSuccess: () => {
                            onClose();
                            navigate('/transactions');
                        }
                    });
                }
            }}>
                Verwijder
            </button>
        </form>
        </div>
    </div>

  )
}

export default SelectedTransactionForm