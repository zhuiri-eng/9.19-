import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PaymentStatus, checkPaymentStatus, pollPaymentStatus } from '@/services/paymentService';
import { toast } from 'sonner';

export default function PaymentResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { payId, orderId, amount, productName } = location.state || {};
  
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.PENDING);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('正在查询支付状态...');
  const [paidTime, setPaidTime] = useState<string>('');
  const [stopPolling, setStopPolling] = useState<(() => void) | null>(null);

  useEffect(() => {
    if (!payId) {
      navigate('/');
      return;
    }

    // 开始轮询支付状态
    const stop = pollPaymentStatus(
      payId,
      (result) => {
        setIsLoading(false);
        
        if (result.success && result.data) {
          setPaymentStatus(result.data.status);
          setMessage(result.message);
          
          if (result.data.paidTime) {
            setPaidTime(result.data.paidTime);
          }
          
          // 根据支付状态显示不同的提示
          switch (result.data.status) {
            case PaymentStatus.PAID:
              toast.success('支付成功！');
              break;
            case PaymentStatus.FAILED:
              toast.error('支付失败');
              break;
            case PaymentStatus.EXPIRED:
              toast.error('支付已过期');
              break;
            case PaymentStatus.CANCELLED:
              toast.error('支付已取消');
              break;
          }
        } else {
          setMessage(result.message || '查询支付状态失败');
          toast.error(result.message || '查询失败');
        }
      },
      3000, // 每3秒查询一次
      60    // 最多查询60次（3分钟）
    );
    
    setStopPolling(() => stop);

    // 清理函数
    return () => {
      if (stop) {
        stop();
      }
    };
  }, [payId, navigate]);

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleViewReport = () => {
    navigate('/report');
  };

  const handleRetryPayment = () => {
    navigate('/');
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case PaymentStatus.PAID:
        return <i className="fa fa-check-circle text-6xl text-green-500"></i>;
      case PaymentStatus.FAILED:
        return <i className="fa fa-times-circle text-6xl text-red-500"></i>;
      case PaymentStatus.EXPIRED:
        return <i className="fa fa-clock text-6xl text-orange-500"></i>;
      case PaymentStatus.CANCELLED:
        return <i className="fa fa-ban text-6xl text-gray-500"></i>;
      default:
        return <i className="fa fa-spinner fa-spin text-6xl text-blue-500"></i>;
    }
  };

  const getStatusText = () => {
    switch (paymentStatus) {
      case PaymentStatus.PAID:
        return '支付成功';
      case PaymentStatus.FAILED:
        return '支付失败';
      case PaymentStatus.EXPIRED:
        return '支付已过期';
      case PaymentStatus.CANCELLED:
        return '支付已取消';
      default:
        return '正在处理中...';
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case PaymentStatus.PAID:
        return 'text-green-600 dark:text-green-400';
      case PaymentStatus.FAILED:
        return 'text-red-600 dark:text-red-400';
      case PaymentStatus.EXPIRED:
        return 'text-orange-600 dark:text-orange-400';
      case PaymentStatus.CANCELLED:
        return 'text-gray-600 dark:text-gray-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  if (!payId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center text-white">
            <h1 className="text-2xl font-bold">支付结果</h1>
          </div>

          {/* Content */}
          <div className="p-8 text-center">
            {/* Status Icon */}
            <div className="mb-6">
              {getStatusIcon()}
            </div>

            {/* Status Text */}
            <h2 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
              {getStatusText()}
            </h2>

            {/* Message */}
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {message}
            </p>

            {/* Order Info */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">订单信息</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">商品名称:</span>
                  <span className="text-gray-900 dark:text-white">{productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">订单号:</span>
                  <span className="text-gray-900 dark:text-white font-mono">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">支付金额:</span>
                  <span className="text-gray-900 dark:text-white font-bold">¥{amount}</span>
                </div>
                {paidTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">支付时间:</span>
                    <span className="text-gray-900 dark:text-white">{paidTime}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {paymentStatus === PaymentStatus.PAID && (
                <button
                  onClick={handleViewReport}
                  className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                  <i className="fa fa-file-text mr-2"></i>
                  查看报告
                </button>
              )}
              
              {paymentStatus === PaymentStatus.FAILED && (
                <button
                  onClick={handleRetryPayment}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <i className="fa fa-redo mr-2"></i>
                  重新支付
                </button>
              )}
              
              {paymentStatus === PaymentStatus.EXPIRED && (
                <button
                  onClick={handleRetryPayment}
                  className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
                >
                  <i className="fa fa-redo mr-2"></i>
                  重新支付
                </button>
              )}
              
              <button
                onClick={handleBackToHome}
                className="w-full py-3 px-4 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors"
              >
                <i className="fa fa-home mr-2"></i>
                返回首页
              </button>
            </div>

            {/* Loading Indicator */}
            {isLoading && (
              <div className="mt-6 text-center">
                <div className="inline-flex items-center text-blue-600 dark:text-blue-400">
                  <i className="fa fa-spinner fa-spin mr-2"></i>
                  正在查询支付状态...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>如有问题，请联系客服</p>
        </div>
      </div>
    </div>
  );
}
