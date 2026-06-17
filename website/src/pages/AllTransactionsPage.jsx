import { Link } from "react-router"
import '../styles/transactionPage.css'
import { useAuth } from "@clerk/react";
import { useTransactions, useUpdateTransaction } from "../hooks/useTransactions";
import { useCategories } from "../hooks/useCategories";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import SelectedTransactionForm from "../components/SelectedTransactionForm";

function AllTransactionsPage({...props}) {
    const { userId } = useAuth();
    const [searchbarValue, setSearchbarValue] = useState('');
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { data: transactions, isLoading, error } = useTransactions();
    const { data: categories } = useCategories();
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const updateTransactionMutation = useUpdateTransaction();
    const filteredTransactions = transactions?.filter(transaction => transaction.name.toLowerCase().includes(searchbarValue.toLowerCase()) || transaction.description.toLowerCase().includes(searchbarValue.toLowerCase()) || transaction.type.toLowerCase().includes(searchbarValue.toLowerCase()));

  return (
    <div {...props}>
        <Link className="back" to="/transactions/add">+ Voeg een transactie toe</Link>
        <div className="functionality-div">
          <div className="searchBar">
            <input name="searchBar" type="text" placeholder="Zoek transacties..." onChange={(e) => setSearchbarValue(e.target.value)} />
            <button onClick={() => setSearchbarValue('')}>Clear</button>
          </div>
          <div className="filter">
            <button >Filter</button>
          </div>
        </div>
        <div className='all-transactions-container'>
        {searchbarValue && (<p>Zoekresultaten voor "{searchbarValue}":</p>)}
        <li className="transaction-header">
            <span data-testid="transaction-header-name"><h3>Naam</h3></span>
            <span data-testid="transaction-header-description"><h3>Beschrijving</h3></span>
            <span data-testid="transaction-header-amount"><h3>Bedrag</h3></span>
            <span data-testid="transaction-header-date"><h3>Datum</h3></span>
            <span data-testid="transaction-header-category"><h3>Categorie</h3></span>
            <span data-testid="transaction-header-actions"><h3>Acties</h3></span>
          </li>
        {searchbarValue ? (
          <>
          <ul className='transaction-list' data-testid="transactions-list">
            {filteredTransactions && filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <li className='transaction-list-items' key={transaction.id}>
                  <span data-testid="transaction-name">{transaction.name}</span>
              <span data-testid="transaction-description">{transaction.description}</span>
              <span data-testid="transaction-amount" className={transaction.type === "income" ? "income" : transaction.type === "savings" ? "savings" : "expense"}>
                {transaction.type === "income" || transaction.type === "savings" ? `+€${transaction.amount}` : `-€${transaction.amount}`}
              </span>
              <span data-testid="transaction-date">{new Date(transaction.date).toLocaleDateString()}</span>
              <span data-testid="transaction-category">{categories?.find((cat) => cat.id === transaction.categoryId)?.name || 'Geen categorie'}{categories?.find((cat) => cat.id === transaction.categoryId)?.color && (
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
              <button aria-label="Bewerk transactie" className='edit-btn' onClick={() => setSelectedTransaction(transaction)} data-testid={`edit-btn-${transaction.id}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 20H21" stroke="#00A6FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16.5 3.50001C16.8978 3.10219 17.4374 2.87869 18 2.87869C18.2786 2.87869 18.5544 2.93356 18.8118 3.04017C19.0692 3.14677 19.303 3.30303 19.5 3.50001C19.697 3.697 19.8532 3.93085 19.9598 4.18822C20.0665 4.44559 20.1213 4.72144 20.1213 5.00001C20.1213 5.27859 20.0665 5.55444 19.9598 5.81181C19.8532 6.06918 19.697 6.30303 19.5 6.50001L7 19L3 20L4 16L16.5 3.50001Z" stroke="#00A6FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </li>
              ))
            ) : (
              <p>Geen transacties gevonden.</p>
            )}
          </ul>
        </>
        ) : (
          <ul className='transaction-list' data-testid="transactions-list">
          {transactions && transactions.length > 0 ? (
          transactions.map((transaction) => (
            <li className='transaction-list-items' key={transaction.id}>
              <span data-testid="transaction-name">{transaction.name}</span>
              <span data-testid="transaction-description">{transaction.description}</span>
              <span data-testid="transaction-amount" className={transaction.type === "income" ? "income" : transaction.type === "savings" ? "savings" : "expense"}>
                {transaction.type === "income" || transaction.type === "savings" ? `+€${transaction.amount}` : `-€${transaction.amount}`}
              </span>
              <span data-testid="transaction-date">{new Date(transaction.date).toLocaleDateString()}</span>
              <span data-testid="transaction-category">{categories?.find((cat) => cat.id === transaction.categoryId)?.name || 'Geen categorie'}{categories?.find((cat) => cat.id === transaction.categoryId)?.color && (
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
              <button aria-label="Bewerk transactie" className='edit-btn' onClick={() => setSelectedTransaction(transaction)} data-testid={`edit-btn-${transaction.id}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 20H21" stroke="#00A6FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16.5 3.50001C16.8978 3.10219 17.4374 2.87869 18 2.87869C18.2786 2.87869 18.5544 2.93356 18.8118 3.04017C19.0692 3.14677 19.303 3.30303 19.5 3.50001C19.697 3.697 19.8532 3.93085 19.9598 4.18822C20.0665 4.44559 20.1213 4.72144 20.1213 5.00001C20.1213 5.27859 20.0665 5.55444 19.9598 5.81181C19.8532 6.06918 19.697 6.30303 19.5 6.50001L7 19L3 20L4 16L16.5 3.50001Z" stroke="#00A6FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </li>
          ))
        ) : (
          <p>Geen transacties gevonden.</p>
        )}
        </ul>
        )
        }
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