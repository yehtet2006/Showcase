import { useAuth } from '@clerk/react';
import { useTransaction, useAddTransaction, useDeleteTransaction, useTransactions, useUpdateTransaction } from "../hooks/useTransactions";
import { useCategories, useAddCategory } from '../hooks/useCategories';
import { useParams, Link, useNavigate } from "react-router";
import { useState } from 'react';
import { addTransaction, updateTransaction } from '../lib/api';
import { useQueryClient } from '@tanstack/react-query';
import '../styles/transactionPage.css'
import SelectedTransactionForm from '../components/SelectedTransactionForm';

function TransactionsPage() {
  // const { transactionId } = useParams();
  const { userId }  = useAuth();
  const navigate = useNavigate();
  // For adding transaction
  const queryClient = useQueryClient();
  const { mutateAsync: addTransaction } = useAddTransaction();
  const { mutateAsync: addCategory } = useAddCategory();
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    type: '',
    date: '',
    description: '',
    categoryId: ''
  })
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: ''
  });
  const { data: categories } = useCategories();
  const { data: transactions, isLoading, error } = useTransactions();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name || !formData.amount || !formData.type || !formData.date) {
        alert('Please fill in all required fields');
        return;
      }

      if (formData.type !== 'income' && formData.type !== 'expense') {
        alert('Please select a valid type');
        return;
      } else if (isNaN(formData.amount) || Number(formData.amount) <= 0) {
        alert('Please enter a valid positive number for amount');
        return;
      }
      
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
  const handleAddCategory = async () => {
    try {
      if (!newCategory.name || !newCategory.color) {
        alert('Please fill in both category name and color');
        return;
      }
      await addCategory({
        ...newCategory
      });
      queryClient.invalidateQueries(['transactions']);
      setNewCategory({ name: '', color: '' });
    } catch (error) {
      console.error('Error adding category:', error);
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
            <option value="">Selecteer de type</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <label>Date:</label>
          <input type="date" name="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} /> 
          <label>Category:</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={(e) =>
              setFormData({ ...formData, categoryId: e.target.value })
            }
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
              
            ))}
          </select>

          {/* Add new category */}
          <div className='add-category-container'>
            <input
              className='category-input'
              type="text"
              placeholder="New category"
              value={newCategory.name}
              onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
            />
            <input
              type="color"
              value={newCategory.color}
              onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
            />
            <button type="button" onClick={handleAddCategory}>
              Add
            </button>
          </div>
          <button type="submit">Toevoegen</button>
          <button className='reset' type="button" onClick={() => setFormData({
            name: '',
            amount: '',
            type: '',
            date: '',
            description: '',
            categoryId: ''
          })}>
            Reset
          </button>
        </form>
      </div>
      <div className='all-transactions-container'>
        <div className='top-row-filter'>
          <span>Recente Transacties</span> <br />
          <Link className='all-transactions-link' to="/transactions/all">Bekijk alle transacties</Link>
        </div>
        <li className="transaction-header">
            <span><h3>Name</h3></span>
            <span><h3>Description</h3></span>
            <span><h3>Amount</h3></span>
            <span><h3>Date</h3></span>
            <span><h3>Category</h3></span>
          </li>
        <ul className='transaction-list'>
          {transactions && transactions.length > 0 ? (
          transactions.map((transaction) => (
            <li className='transaction-list-items' key={transaction.id}>
              <span>{transaction.name}</span>
              <span>{transaction.description}</span>
              <span className={transaction.type === "income" ? "income" : "expense"}>
                {/* {transaction.amount} */}{transaction.type === "income" ? `+$${transaction.amount}` : `-$${transaction.amount}`}
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