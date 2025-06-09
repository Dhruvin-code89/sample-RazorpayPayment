import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentId, orderId } = location.state || {};

  return (
    <div className="success-container">
      <div className="success-card">
        <h1>Payment Successful!</h1>
        <div className="details">
          <p>Payment ID: {paymentId}</p>
          <p>Order ID: {orderId}</p>
        </div>
        <button onClick={() => navigate('/')} className="back-button">
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess; 