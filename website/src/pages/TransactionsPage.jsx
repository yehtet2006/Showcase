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
    date: new Date().toISOString().split('T')[0],
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

      if (formData.type !== 'income' && formData.type !== 'expense' && formData.type !== 'savings') {
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
      setFormData({
            name: '',
            amount: '',
            type: '',
            date: new Date().toISOString().split('T')[0],
            description: '',
            categoryId: ''
          })
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
        <form onSubmit={handleSubmit} className='transaction-form' data-testid="add-transaction-form">
          <label data-testid="transaction-name-label">Name:</label>
          <input data-testid="transaction-name-input" type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          
          <label data-testid="transaction-amount-label">Amount:</label>
          <input data-testid="transaction-amount-input" type="number" name="amount" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />

          <label data-testid="transaction-type-label">Type:</label>
          <div className="type-toggle">
            <button data-testid="transaction-income-button" type="button" className={formData.type === "income" ? "active income-btn" : ""} onClick={() => setFormData({ ...formData, type: "income" })}>
              Inkomen
            </button>
            <button data-testid="transaction-expense-button" type="button" className={formData.type === "expense" ? "active expense-btn" : ""} onClick={() => setFormData({ ...formData, type: "expense" })}>
              Uitgaven
            </button>
            <button data-testid="transaction-savings-button" type="button" className={formData.type === "savings" ? "active savings-btn" : ""} onClick={() => setFormData({ ...formData, type: "savings" })}>
              Sparen
            </button>
          </div>
          
          <label data-testid="transaction-date-label">Date:</label>
          <input data-testid="transaction-date-input" type="date" name="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
          
          <label data-testid="transaction-description-label">Description:</label>
          <textarea data-testid="transaction-description-input" name="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} /> 
          
          <label data-testid="transaction-category-label">Category:</label>
          <select data-testid="transaction-category-select" name="categoryId" value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}>
            <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
            ))}
          </select>

          {/* Add new category */}
          <div className='add-category-container'>
            <input data-testid="new-category-name-input" className='category-input' type="text" placeholder="Add new category" value={newCategory.name} onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}/>
            <input data-testid="new-category-color-input" type="color" value={newCategory.color} onChange={(e) => setNewCategory({...newCategory, color: e.target.value})} />
            <button data-testid="add-category-button" type="button" onClick={handleAddCategory}>
              Voeg categorie toe
            </button>
          </div>
          <button data-testid="add-transaction-button" type="submit">
            Toevoegen
          </button>
          <button data-testid="reset-transaction-button" className='reset' type="button" onClick={() => setFormData({
            name: '',
            amount: '',
            type: '',
            date: new Date().toISOString().split('T')[0],
            description: '',
            categoryId: ''
          })}>
            Reset
          </button>
        </form>
      </div>

      {/* All Transactions */}
      <div className='all-transactions-container'>
        <div className='top-row-filter'>
          <span>Recente Transacties</span> <br />
          <Link className='all-transactions-link' to="/transactions">Bekijk alle transacties</Link>
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
              <span>{transaction.type === 'income' || transaction.type === 'savings' ? (
                <span className={transaction.type === 'income' ? 'income' : 'savings'}>+€{transaction.amount}</span>
              ) : transaction.type === 'expense' ? (
                <span className='expense'>-€{transaction.amount}</span>
              ) : null}</span>
              <span>{new Date(transaction.date).toLocaleDateString()}</span>
              <span>
                {categories?.find((cat) => cat.id === transaction.categoryId)?.name || 'No category'}{categories?.find((cat) => cat.id === transaction.categoryId)?.color && (
                  <span className='color' style={{background: categories?.find((cat) => cat.id === transaction.categoryId)?.color, padding: '4px 8px', borderRadius: '6px', marginLeft: '8px'}}></span>
                )}
              </span>
            </li>
          ))
        ) : (<p>No transactions found.</p>)}
        </ul>
      </div>
    </div>
  )
}

export default TransactionsPage