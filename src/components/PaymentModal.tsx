import { useState, useEffect } from 'react';
import { PaymentType, createPaymentOrder, PaymentStatus, pollPaymentStatus, testApiConnection } from '@/services/paymentService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  productName: string;
  amount: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  onPaymentSuccess,
  productName,
  amount
}: PaymentModalProps) {
  const navigate = useNavigate();
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType>(PaymentType.WECHAT);
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');
  const [payUrl, setPayUrl] = useState<string>('');
  const [currentPayId, setCurrentPayId] = useState<string>('');
  const [currentOrderId, setCurrentOrderId] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.PENDING);
  const [isPolling, setIsPolling] = useState(false);
  const [stopPolling, setStopPolling] = useState<(() => void) | null>(null);

  // 测试API连接
  const handleTestApi = async () => {
    try {
      const result = await testApiConnection();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('API测试失败');
      console.error('API测试错误:', error);
    }
  };

  const handlePayment = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    
    try {
      console.log('开始创建支付订单...', { productName, amount, selectedPaymentType });
      
      // 生成唯一的订单号
      const payId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const result = await createPaymentOrder({
        payId: payId,
        param: productName,
        type: selectedPaymentType,
        price: amount,
        isHtml: 1
      });
      
      console.log('支付订单创建结果:', result);
      
      // 设置调试信息
      
      if (result.success && result.data) {
        console.log('支付数据:', result.data);
        
        // 保存支付ID和订单ID用于状态查询
        if (result.data.payId) {
          setCurrentPayId(result.data.payId);
          console.log('支付ID:', result.data.payId);
        }
        if (result.data.orderId) {
          setCurrentOrderId(result.data.orderId);
          console.log('订单ID:', result.data.orderId);
        }
        
        // 检查是否是重定向响应
        if (result.data.redirectScript) {
          console.log('检测到重定向脚本，显示支付页面');
          console.log('重定向脚本内容:', result.data.redirectScript);
          console.log('提取的支付URL:', result.data.payUrl);
          
          // 构建完整的支付URL
          const fullPayUrl = `https://2277857.pay.lanjingzf.com${result.data.payUrl}`;
          console.log('完整支付URL:', fullPayUrl);
          setPayUrl(fullPayUrl);
          toast.success('订单创建成功，请点击支付按钮');
          // 暂时禁用轮询，先让支付按钮正常工作
          // startPolling(result.data.payId);
          return;
        }
        
        // 优先显示二维码，如果没有二维码则显示支付链接
        if (result.data.payUrl) {
          console.log('设置支付二维码:', result.data.payUrl);
          setQrCode(result.data.payUrl); // payUrl就是二维码内容
          toast.success('订单创建成功，请扫码支付');
          // 开始轮询支付状态
          startPolling(result.data.payId);
        } else {
          console.log('没有获取到支付二维码，原始响应:', result.data.rawResponse);
          toast.error('未获取到支付信息，请查看调试信息');
        }
      } else {
        console.error('支付失败:', result);
        toast.error(result.message || '支付失败，请重试');
      }
    } catch (error) {
      console.error('支付处理错误:', error);
      toast.error('支付处理失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  // 开始轮询支付状态
  const startPolling = (payId: string) => {
    if (isPolling) return;
    
    setIsPolling(true);
    console.log('开始轮询支付状态:', payId);
    
    const stop = pollPaymentStatus(
      payId,
      (result) => {
        console.log('支付状态更新:', result);
        
        if (result.success && result.data) {
          setPaymentStatus(result.data.status);
          
          switch (result.data.status) {
            case PaymentStatus.PAID:
              toast.success('支付成功！');
              onPaymentSuccess();
              navigate('/payment-result', {
                state: {
                  payId: result.data.payId,
                  orderId: result.data.orderId,
                  amount: amount,
                  productName: productName,
                  paidTime: result.data.paidTime
                }
              });
              onClose();
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
        }
      },
      3000, // 每3秒查询一次
      60    // 最多查询60次（3分钟）
    );
    
    setStopPolling(() => stop);
  };

  // 停止轮询
  const stopPollingFunction = () => {
    if (stopPolling) {
      stopPolling();
      setStopPolling(null);
      setIsPolling(false);
    }
  };

  // 清理函数
  useEffect(() => {
    return () => {
      stopPollingFunction();
    };
  }, []);

  const handlePaymentSuccess = () => {
    onPaymentSuccess();
    onClose();
    setQrCode('');
    setPayUrl('');
    stopPollingFunction();
  };

  const handleClose = () => {
    stopPollingFunction();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isPolling ? '支付中...' : '选择支付方式'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <i className="fa fa-times text-xl"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Product Info */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">商品信息</h3>
            <p className="text-gray-600 dark:text-gray-300">{productName}</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-2">¥{amount}</p>
            {currentPayId && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-medium">订单号:</span> {currentPayId}
                </p>
              </div>
            )}
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">支付方式</h3>
            <div className="space-y-3">
              <label className="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input
                  type="radio"
                  name="paymentType"
                  value={PaymentType.WECHAT}
                  checked={selectedPaymentType === PaymentType.WECHAT}
                  onChange={(e) => setSelectedPaymentType(e.target.value as PaymentType)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                />
                <div className="ml-3 flex items-center">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3">
                    <i className="fa fa-weixin text-green-600 dark:text-green-400"></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">微信支付</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">使用微信扫码支付</p>
                  </div>
                </div>
              </label>

              <label className="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input
                  type="radio"
                  name="paymentType"
                  value={PaymentType.ALIPAY}
                  checked={selectedPaymentType === PaymentType.ALIPAY}
                  onChange={(e) => setSelectedPaymentType(e.target.value as PaymentType)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                />
                <div className="ml-3 flex items-center">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                    <i className="fa fa-credit-card text-blue-600 dark:text-blue-400"></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">支付宝</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">使用支付宝扫码支付</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* QR Code Display */}
          {qrCode && (
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
                  <i className="fa fa-qrcode mr-2 text-blue-600 dark:text-blue-400"></i>
                  蓝鲸支付二维码
                </h3>
                <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-200 dark:border-blue-800 inline-block">
                  <img 
                    src={qrCode} 
                    alt="蓝鲸支付二维码" 
                    className="w-64 h-64 mx-auto"
                    onError={(e) => {
                      console.error('二维码加载失败');
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                    <i className="fa fa-mobile-alt mr-1"></i>
                    请使用{selectedPaymentType === PaymentType.WECHAT ? '微信' : '支付宝'}扫描上方二维码完成支付
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    支付金额：¥{amount}
                  </p>
                  
                  {/* 订单信息显示 */}
                  {(currentPayId || currentOrderId) && (
                    <div className="mt-3 pt-3 border-t border-amber-300 dark:border-amber-700">
                      <div className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
                        {currentPayId && (
                          <div className="flex justify-between">
                            <span>商户订单号:</span>
                            <span className="font-mono">{currentPayId}</span>
                          </div>
                        )}
                        {currentOrderId && (
                          <div className="flex justify-between">
                            <span>云端订单号:</span>
                            <span className="font-mono">{currentOrderId}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Payment Status Indicator */}
              {isPolling && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-center text-green-600 dark:text-green-400">
                    <i className="fa fa-spinner fa-spin mr-2"></i>
                    <span className="text-sm font-medium">正在等待支付完成，请勿关闭此页面...</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pay URL Display */}
          {payUrl && !qrCode && (
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
                  <i className="fa fa-external-link-alt mr-2 text-green-600 dark:text-green-400"></i>
                  蓝鲸支付链接
                </h3>
                <div className="bg-white p-4 rounded-lg border-2 border-green-200 dark:border-green-800">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">请点击下方按钮完成支付：</p>
                  
                  {/* 订单信息显示 */}
                  {(currentPayId || currentOrderId) && (
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        {currentPayId && (
                          <div className="flex justify-between">
                            <span>商户订单号:</span>
                            <span className="font-mono">{currentPayId}</span>
                          </div>
                        )}
                        {currentOrderId && (
                          <div className="flex justify-between">
                            <span>云端订单号:</span>
                            <span className="font-mono">{currentOrderId}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <a 
                    href={payUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                    onClick={() => {
                      console.log('支付按钮被点击，URL:', payUrl);
                    }}
                  >
                    <i className="fa fa-credit-card mr-2"></i>
                    立即支付 ¥{amount}
                  </a>
                  
                  {/* 调试信息 */}
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    支付URL: {payUrl}
                  </div>
                </div>
                <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    <i className="fa fa-info-circle mr-1"></i>
                    点击后将跳转到蓝鲸支付页面
                  </p>
                </div>
              </div>
            </div>
          )}


          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              取消
            </button>
            
            <button
              onClick={handleTestApi}
              className="px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors"
            >
              测试API
            </button>
            
            {!qrCode && !payUrl ? (
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-blue-400 disabled:to-purple-400 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <i className="fa fa-spinner fa-spin mr-2"></i>
                    正在创建支付订单...
                  </>
                ) : (
                  <>
                    <i className="fa fa-qrcode mr-2"></i>
                    生成蓝鲸支付二维码
                  </>
                )}
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handlePaymentSuccess}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  <i className="fa fa-check mr-2"></i>
                  支付完成
                </button>
                <button
                  onClick={() => {
                    setPayUrl('');
                    setQrCode('');
                    handlePayment();
                  }}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  <i className="fa fa-refresh mr-2"></i>
                  重新生成
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
