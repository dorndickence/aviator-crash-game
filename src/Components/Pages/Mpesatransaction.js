import React, { useState } from 'react';
import axios from 'axios';

const Mpesatransaction = ({ onClose, transactionType, coin, userId }) => {
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTransaction = async () => {
    setLoading(true);
    setError('');

    try {
      // Step 1: Call M-PESA API to initiate payment
      const mpesaResponse = await axios.post('https://m-pesa-prompt.onrender.com/mpesa', {
        amount,
        phoneNumber,
        transactionType,
      });

      // Get the CheckoutRequestID from the M-PESA response
      const checkoutRequestId = mpesaResponse.data.CheckoutRequestID;

      // Step 2: Call your backend to log the deposit or withdrawal
      const depositResponse = await axios.post(`${process.env.REACT_APP_API_URL}/deposit`, {
        payment_id: checkoutRequestId, // Use CheckoutRequestID here
        user_id: userId, // Pass the user ID here
        pay_address: phoneNumber, // Assuming phone number is used as pay_address
        pay_currency: coin.symbol,
        pay_amount: amount,
      });

      console.log('Deposit logged:', depositResponse.data);
      // Handle success (e.g., show a success message)
      onClose(); // Close the modal on success
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