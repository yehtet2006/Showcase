import { useAuth } from '@clerk/react';
import { useTransaction, useAddTransaction, useDeleteTransaction, useTransactions, useUpdateTransaction } from "../hooks/useTransactions";
import { useParams, Link, useNavigate } from "react-router";

function TransactionsPage() {
  const { transactionId } = useParams();
  const { userId }  = useAuth();
  const { data: transactions, isLoading, error } = useTransactions();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  console.log(transactions);


  return (
    <div className='main-container'>
      <div className='add-transaction-container'>Add transaction</div>
      <div className='all-transactions-container'>
        <ul className='transaction-list'>
          {transactions && transactions.length > 0 ? (
          transactions.map((transaction) => (
            <li key={transaction.id}>
              <span>{transaction.name}</span>
              <span>{transaction.type}</span>
              <span>{transaction.amount}</span>
              <span>{transaction.date}</span>
            </li>
          ))
        ) : (
          <p>No transactions found.</p>
        )}
        </ul>
        
      </div>
    </div>
  )
}

export default TransactionsPage