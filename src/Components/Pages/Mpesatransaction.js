import React, { useState } from 'react';
import axios from 'axios';
import './Mpesa.css';

const Mpesatransaction = ({ onClose, transactionType, coin }) => {
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTransaction = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://m-pesa-prompt.onrender.com/mpesa', {
        amount,
        phoneNumber,
        transactionType,
      });
      console.log('Transaction Success:', response.data);
      // Handle success (e.g., show a success message)
    } catch (error) {
      setError('Transaction Failed: ' + (error.response?.data || 'Unknown error'));
      console.error('Transaction Failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <h2>{transactionType === 'deposit' ? 'Deposit' : 'Withdraw'} with M-PESA</h2>
      <input 
        type="text" 
        placeholder="Amount" 
        value={amount}
        onChange={(e) => setAmount(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="Phone Number" 
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)} 
      />
      <button onClick={handleTransaction} disabled={loading}>
        {loading ? 'Processing...' : 'Submit'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default Mpesatransaction;