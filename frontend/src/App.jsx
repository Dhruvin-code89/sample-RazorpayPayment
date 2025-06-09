import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PaymentButton from './components/PaymentButton';
import PaymentSuccess from './pages/PaymentSuccess';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PaymentButton />} />
        <Route path="/success" element={<PaymentSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;
