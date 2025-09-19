import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import ReportPage from "@/pages/Report";
import PaymentResult from "@/pages/PaymentResult";
import PaymentCallback from "@/pages/PaymentCallback";
import { useState } from "react";
import { AuthContext } from '@/contexts/authContext';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('9.99');
  const [productName, setProductName] = useState('玄学命理分析报告');

  const logout = () => {
    setIsAuthenticated(false);
    setHasPaid(false);
  };

  return (
    <AuthContext.Provider
      value={{ 
        isAuthenticated, 
        hasPaid, 
        setIsAuthenticated, 
        setHasPaid, 
        logout,
        paymentAmount,
        setPaymentAmount,
        productName,
        setProductName
      }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/payment-result" element={<PaymentResult />} />
        <Route path="/payment/callback" element={<PaymentCallback />} />
      </Routes>
    </AuthContext.Provider>
  );
}
