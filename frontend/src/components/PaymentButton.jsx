import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PaymentButton.css';

const PaymentButton = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: ''
  });

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const canclePayment = () => {
    setShowForm(false)
    setFormData({
      name: '',
      email: '',
      contact: ''
    })
  }

  const makePayment = async () => {
    setIsLoading(true);
    try {
      if (!formData.name || !formData.email || !formData.contact) {
        alert('Please fill in all details');
        return;
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        alert('Please enter a valid email');
        return;
      }
      if (!/^\d{10}$/.test(formData.contact)) {
        alert('Please enter a valid 10-digit contact number');
        return;
      }

      const keyResponse = await axios.get('http://localhost:5000/get-razorpay-key');
      const razorpayKey = keyResponse.data.key;

      // Create order
      const response = await axios.post('http://localhost:5000/create-order', {
        amount: 50000 // Amount in paise (₹500)
      });

      const order = response.data;

      // Initialize Razorpay
      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: 'INR',
        name: 'Your Company Name',
        description: 'Test Transaction',
        order_id: order.id,
        handler: async function (response) {
          const verificationData = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          };

          try {
            const verifyRes = await axios.post('http://localhost:5000/verify-payment', verificationData);
            if (verifyRes.data.success) {
              navigate('/success', {
                state: {
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id
                }
              });
            } else {
              alert("Payment verification failed");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Error verifying payment.");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.contact
        },
        theme: {
          color: '#3399cc'
        },
        modal: {
          ondismiss: () => {
            alert('Payment popup closed by user');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="payment-container">
      {!showForm ? (
        <button className="payment-button" onClick={() => setShowForm(true)}>
          Make Payment
        </button>
      ) : (
        <div className="payment-form">
          <h2>Enter Your Details</h2>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <input
            type="tel"
            name="contact"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={handleInputChange}
          />
          <div className="form-buttons">
            <button className="submit-button" onClick={makePayment} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Proceed to Pay ₹500'}
            </button>
            <button className="cancel-button" onClick={canclePayment}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentButton;