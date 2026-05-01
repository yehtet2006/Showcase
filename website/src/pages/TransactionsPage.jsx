import { useAuth } from '@clerk/react';
import { useTransaction, useAddTransaction, useDeleteTransaction, useTransactions, useUpdateTransaction } from "../hooks/useTransactions";
import { useParams, Link, useNavigate } from "react-router";
import { useState } from 'react';
import { addTransaction } from '../lib/api';
import { useQueryClient } from '@tanstack/react-query';

function TransactionsPage() {
  const { transactionId } = useParams();
  const { userId }  = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    type: '',
    date: '',
    description: '',
    categoryId: ''
  })
  const queryClient = useQueryClient();
  

  const { mutateAsync: addTransaction } = useAddTransaction();

  const { data: transactions, isLoading, error } = useTransactions();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addTransaction({
        ...formData,
        amount: Number(formData.amount),
        date: new Date(formData.date).toISOString(),
        categoryId: formData.categoryId || null,
      });
      queryClient.invalidateQueries(['transactions']);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };


  return (
    <div className='main-container'>
      <div className='add-transaction-container'>
        <h1>Add Transaction</h1>
        <form onSubmit={handleSubmit} className='transaction-form'>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <label>Amount:</label>
          <input type="number" name="amount" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
          <label>Type:</label>
          <select name="type" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <label>Date:</label>
          <input type="date" name="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          {/* <label>Category:</label>
          <select name="categoryId" value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})}>
            <option value="">Select a category</option>
            {categories && categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select> */}
          <button type="submit">Add Transaction</button>
        </form>
      </div>
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