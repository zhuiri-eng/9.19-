import { createContext } from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  hasPaid: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setHasPaid: (value: boolean) => void;
  logout: () => void;
  // 支付相关状态
  paymentAmount: string;
  setPaymentAmount: (amount: string) => void;
  productName: string;
  setProductName: (name: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  hasPaid: false,
  setIsAuthenticated: (value: boolean) => {},
  setHasPaid: (value: boolean) => {},
  logout: () => {},
  paymentAmount: '9.99',
  setPaymentAmount: (amount: string) => {},
  productName: '玄学命理分析报告',
  setProductName: (name: string) => {},
});