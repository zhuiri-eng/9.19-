import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PaymentStatus } from '@/services/paymentService';

const PaymentCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<PaymentStatus>(PaymentStatus.PENDING);
  const [message, setMessage] = useState('正在处理支付结果...');

  useEffect(() => {
    const handlePaymentCallback = () => {
      // 获取URL参数
      const type = searchParams.get('type'); // return 或 notify
      const payId = searchParams.get('payId');
      const orderId = searchParams.get('orderId');
      const status = searchParams.get('status');
      const sign = searchParams.get('sign');

      console.log('支付回调参数:', {
        type,
        payId,
        orderId,
        status,
        sign
      });

      if (type === 'return') {
        // 同步回调 - 用户支付完成后跳转回来
        setMessage('支付完成，正在验证...');
        
        if (status === 'success' || status === 'paid') {
          setStatus(PaymentStatus.SUCCESS);
          setMessage('支付成功！');
          
          // 3秒后跳转到支付结果页面
          setTimeout(() => {
            navigate('/payment-result', { 
              state: { 
                success: true, 
                payId, 
                orderId,
                message: '支付成功！' 
              } 
            });
          }, 3000);
        } else {
          setStatus(PaymentStatus.FAILED);
          setMessage('支付失败或取消');
          
          setTimeout(() => {
            navigate('/payment-result', { 
              state: { 
                success: false, 
                payId, 
                orderId,
                message: '支付失败或取消' 
              } 
            });
          }, 3000);
        }
      } else if (type === 'notify') {
        // 异步回调 - 服务器通知
        setMessage('收到支付通知，正在处理...');
        
        if (status === 'success' || status === 'paid') {
          setStatus(PaymentStatus.SUCCESS);
          setMessage('支付成功！');
        } else {
          setStatus(PaymentStatus.FAILED);
          setMessage('支付失败');
        }
        
        // 异步回调通常不需要跳转，只需要返回成功响应
        setTimeout(() => {
          setMessage('支付通知处理完成');
        }, 2000);
      } else {
        // 没有指定类型，可能是直接访问
        setMessage('无效的支付回调');
        setStatus(PaymentStatus.FAILED);
        
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    };

    handlePaymentCallback();
  }, [searchParams, navigate]);

  const getStatusIcon = () => {
    switch (status) {
      case PaymentStatus.SUCCESS:
        return (
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
            <i className="fa fa-check text-green-600 dark:text-green-400 text-2xl"></i>
          </div>
        );
      case PaymentStatus.FAILED:
        return (
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
            <i className="fa fa-times text-red-600 dark:text-red-400 text-2xl"></i>
          </div>
        );
      default:
        return (
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
            <i className="fa fa-spinner fa-spin text-blue-600 dark:text-blue-400 text-2xl"></i>
          </div>
        );
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case PaymentStatus.SUCCESS:
        return 'text-green-600 dark:text-green-400';
      case PaymentStatus.FAILED:
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          {getStatusIcon()}
          
          <h1 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
            {status === PaymentStatus.SUCCESS ? '支付成功' : 
             status === PaymentStatus.FAILED ? '支付失败' : '处理中'}
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {message}
          </p>
          
          <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex justify-between">
              <span>回调类型:</span>
              <span>{searchParams.get('type') || '未知'}</span>
            </div>
            <div className="flex justify-between">
              <span>订单号:</span>
              <span className="font-mono">{searchParams.get('payId') || '未知'}</span>
            </div>
            <div className="flex justify-between">
              <span>云端订单号:</span>
              <span className="font-mono">{searchParams.get('orderId') || '未知'}</span>
            </div>
            <div className="flex justify-between">
              <span>支付状态:</span>
              <span>{searchParams.get('status') || '未知'}</span>
            </div>
          </div>
          
          {status === PaymentStatus.PENDING && (
            <div className="mt-6">
              <div className="animate-pulse bg-blue-200 dark:bg-blue-800 h-2 rounded-full">
                <div className="bg-blue-500 h-2 rounded-full animate-pulse"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;
