import { Link } from "react-router"
import '../styles/transactionPage.css'
import { useAuth } from "@clerk/react";
import { useTransactions, useUpdateTransaction } from "../hooks/useTransactions";
import { useCategories } from "../hooks/useCategories";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import SelectedTransactionForm from "../components/SelectedTransactionForm";

function AllTransactionsPage() {
    const { userId } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { data: transactions, isLoading, error } = useTransactions();
    const { data: categories } = useCategories();
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const updateTransactionMutation = useUpdateTransaction();

  return (
    <div>
        <Link className="back" to="/transactions/add">+ Voeg een transactie toe</Link>
        <div className='all-transactions-container'>
        <li className="transaction-header">
            <span><h3>Name</h3></span>
            <span><h3>Description</h3></span>
            <span><h3>Amount</h3></span>
            <span><h3>Date</h3></span>
            <span><h3>Category</h3></span>
            <span><h3>Actions</h3></span>
          </li>
        <ul className='transaction-list'>
          {transactions && transactions.length > 0 ? (
          transactions.map((transaction) => (
            <li className='transaction-list-items' key={transaction.id}>
              <span>{transaction.name}</span>
              <span>{transaction.description}</span>
              <span className={transaction.type === "income" ? "income" : transaction.type === "savings" ? "savings" : "expense"}>
                {transaction.type === "income" || transaction.type === "savings" ? `+$${transaction.amount}` : `-$${transaction.amount}`}
              </span>
              <span>{new Date(transaction.date).toLocaleDateString()}</span>
              <span>{categories?.find((cat) => cat.id === transaction.categoryId)?.name || 'No category'}{categories?.find((cat) => cat.id === transaction.categoryId)?.color && (
                <span className='color'
                  style={{
                    background: categories?.find((cat) => cat.id === transaction.categoryId)?.color,
                    padding: '4px 8px',
                    borderRadius: '6px',
                    marginLeft: '8px'
                  }}
                >
                </span>
              )}</span>
              <button className='edit-btn' onClick={() => setSelectedTransaction(transaction)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 20H21" stroke="#00A6FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16.5 3.50001C16.8978 3.10219 17.4374 2.87869 18 2.87869C18.2786 2.87869 18.5544 2.93356 18.8118 3.04017C19.0692 3.14677 19.303 3.30303 19.5 3.50001C19.697 3.697 19.8532 3.93085 19.9598 4.18822C20.0665 4.44559 20.1213 4.72144 20.1213 5.00001C20.1213 5.27859 20.0665 5.55444 19.9598 5.81181C19.8532 6.06918 19.697 6.30303 19.5 6.50001L7 19L3 20L4 16L16.5 3.50001Z" stroke="#00A6FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </li>
          ))
        ) : (
          <p>No transactions found.</p>
        )}
        </ul>
        
      </div>
      {selectedTransaction && (
        <SelectedTransactionForm 
          transaction={selectedTransaction}
          isPending={updateTransactionMutation.isPending}
          isError={updateTransactionMutation.isError}
          onClose={() => setSelectedTransaction(null)}
          onSubmit={(formData) => {
            updateTransactionMutation.mutate({ id: selectedTransaction.id, ...formData }, {
              onSuccess: (updatedTransaction) => {
                setSelectedTransaction(null); // was setSelectedTransactionId(null)
                queryClient.invalidateQueries(['transactions']);
                queryClient.invalidateQueries(['transactions', updatedTransaction.id]);
                navigate('/transactions');
              }
            })
          }}
        /> 
      )}
    </div>
  )
}

export default AllTransactionsPage