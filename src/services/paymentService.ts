import CryptoJS from 'crypto-js';

// 支付配置
const PAYMENT_CONFIG = {
  apiUrl: 'https://2277857.pay.lanjingzf.com/createOrder', // 直接使用API URL
  queryUrl: 'https://2277857.pay.lanjingzf.com/queryOrder', // 支付状态查询接口
  callbackUrl: 'https://effortless-bienenstitch-3b0893.netlify.app/callback', // 同步回调地址（Netlify）
  notifyUrl: 'https://effortless-bienenstitch-3b0893.netlify.app/.netlify/functions/payment-callback', // 异步回调地址（Netlify）
  appSecret: 'f659709e38ab01a9d77e52cdcda9a914', // 正确的通讯密钥
  merchantNo: '2277857', // 商户号
};

// 支付类型枚举
export enum PaymentType {
  WECHAT = '1', // 微信支付
  ALIPAY = '2', // 支付宝支付
}

// 支付状态枚举
export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

// 支付请求接口
export interface PaymentRequest {
  payId: string;
  param: string;
  type: string; // 字符串类型："1"微信 "2"支付宝
  price: string;
  merchantNo?: string; // 商户号
  isHtml?: number; // 建议传入1则自动跳转到支付页面
  returnUrl?: string; // 同步回调地址
  notifyUrl?: string; // 异步回调地址
}

// 支付响应接口
export interface PaymentResponse {
  success: boolean;
  message: string;
  data?: {
    payId: string;
    orderId: string;
    payType: number;
    price: number;
    reallyPrice: number;
    payUrl: string;
    qrCode?: string; // 二维码内容
    redirectScript: string;
    rawResponse: string;
  };
  rawResponse?: string;
}

// 生成签名
export function generateSignature(payId: string, param: string, type: string, price: string): string {
  const signStr = `${payId}${param}${type}${price}${PAYMENT_CONFIG.appSecret}`;
  console.log('签名字符串:', signStr);
  console.log('参数类型检查:', {
    payId: typeof payId,
    param: typeof param,
    type: typeof type,
    price: typeof price,
    appSecret: typeof PAYMENT_CONFIG.appSecret
  });
  
  const signature = CryptoJS.MD5(signStr).toString();
  console.log('生成的签名:', signature);
  return signature;
}

// 创建支付订单
export async function createPaymentOrder(request: PaymentRequest): Promise<PaymentResponse> {
  try {
    console.log('创建支付订单请求:', request);
    
    // 生成签名
    const signature = generateSignature(request.payId, request.param, request.type, request.price);
    
    // 构建请求参数
    const requestParams = {
      ...request,
      merchantNo: request.merchantNo || PAYMENT_CONFIG.merchantNo, // 确保商户号被传入
      returnUrl: request.returnUrl || `${PAYMENT_CONFIG.callbackUrl}?type=return&payId=${request.payId}`, // 同步回调地址（用户支付完成后跳转）
      notifyUrl: request.notifyUrl || PAYMENT_CONFIG.notifyUrl, // 异步回调地址（服务器通知）
      sign: signature
    };
    
    console.log('请求参数:', requestParams);
    
    // 构建请求体
    const body = new URLSearchParams();
    Object.entries(requestParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        body.append(key, String(value));
      }
    });
    
    console.log('请求体:', body.toString());
    
    // 发送请求
    const response = await fetch(PAYMENT_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json, text/html, */*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: body.toString(),
      mode: 'cors'
    }).catch(error => {
      console.error('网络请求失败:', error);
      throw new Error(`网络请求失败: ${error.message}`);
    });
    
    console.log('响应状态:', response.status);
    console.log('响应头:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('响应内容长度:', responseText.length);
    console.log('响应内容类型:', typeof responseText);
    
    // 检查是否是重定向脚本
    if (responseText.includes('window.location.href')) {
      console.log('检测到重定向脚本');
      
      // 提取订单ID和支付URL
      const orderIdMatch = responseText.match(/orderId=([^&'"]+)/);
      const orderId = orderIdMatch ? orderIdMatch[1] : '';
      
      const payUrlMatch = responseText.match(/window\.location\.href\s*=\s*['"]([^'"]+)['"]/);
      const payUrl = payUrlMatch ? payUrlMatch[1] : '';
      
      console.log('提取的订单ID:', orderId);
      console.log('提取的支付URL:', payUrl);
      
      // 构建完整的支付URL
      const fullPayUrl = `https://2277857.pay.lanjingzf.com${payUrl}`;
      
      return {
        success: true,
        message: '订单创建成功，正在跳转到支付页面',
        data: {
          payId: request.payId,
          orderId: orderId,
          payType: parseInt(request.type),
          price: parseFloat(request.price),
          reallyPrice: parseFloat(request.price),
          payUrl: fullPayUrl,
          qrCode: fullPayUrl, // 将支付URL作为二维码内容
          redirectScript: responseText,
          rawResponse: responseText
        }
      };
    }
    
    // 尝试解析JSON响应
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.log('JSON解析失败，使用原始响应');
      responseData = { raw: responseText };
    }
    
    console.log('解析后的响应数据:', responseData);
    
    if (response.ok) {
      return {
        success: true,
        message: '订单创建成功',
        data: responseData.data || responseData,
        rawResponse: responseText
      };
    } else {
      return {
        success: false,
        message: responseData.msg || responseData.message || '订单创建失败',
        rawResponse: responseText
      };
    }
  } catch (error) {
    console.error('创建支付订单失败:', error);
    return {
      success: false,
      message: `订单创建失败: ${error instanceof Error ? error.message : '未知错误'}`,
      rawResponse: error instanceof Error ? error.message : '未知错误'
    };
  }
}

// 查询支付状态
export async function queryPaymentStatus(payId: string): Promise<PaymentResponse> {
  try {
    console.log('查询支付状态:', payId);
    
    const response = await fetch(`${PAYMENT_CONFIG.queryUrl}?payId=${payId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      mode: 'cors'
    });
    
    console.log('查询响应状态:', response.status);
    
    if (!response.ok) {
      return {
        success: false,
        message: `查询失败: ${response.status} ${response.statusText}`,
        rawResponse: await response.text()
      };
    }
    
    const responseData = await response.json();
    console.log('查询响应数据:', responseData);
    
    return {
      success: true,
      message: '查询成功',
      data: responseData,
      rawResponse: JSON.stringify(responseData)
    };
  } catch (error) {
    console.error('查询支付状态失败:', error);
    return {
      success: false,
      message: `查询失败: ${error instanceof Error ? error.message : '未知错误'}`,
      rawResponse: error instanceof Error ? error.message : '未知错误'
    };
  }
}

// 手动检查支付状态（用于调试）
export async function checkPaymentStatusManually(payId: string): Promise<{success: boolean, message: string, data?: any}> {
  try {
    console.log('手动检查支付状态:', payId);
    
    const result = await queryPaymentStatus(payId);
    
    if (result.success) {
      console.log('手动检查结果:', result.data);
      return {
        success: true,
        message: '查询成功',
        data: result.data
      };
    } else {
      return {
        success: false,
        message: result.message || '查询失败'
      };
    }
  } catch (error) {
    console.error('手动检查支付状态失败:', error);
    return {
      success: false,
      message: `检查失败: ${error instanceof Error ? error.message : '未知错误'}`
    };
  }
}

// 测试API连接
export async function testApiConnection(): Promise<{success: boolean, message: string}> {
  try {
    console.log('测试API连接...');
    
    const testParams = {
      payId: 'TEST_' + Date.now(),
      param: '测试商品',
      type: '1',
      price: '0.01',
      merchantNo: PAYMENT_CONFIG.merchantNo,
      sign: generateSignature('TEST_' + Date.now(), '测试商品', '1', '0.01')
    };
    
    const body = new URLSearchParams();
    Object.entries(testParams).forEach(([key, value]) => {
      body.append(key, String(value));
    });
    
    const response = await fetch(PAYMENT_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json, text/html, */*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: body.toString(),
      mode: 'cors'
    });
    
    const responseText = await response.text();
    console.log('API测试响应:', response.status, responseText);
    
    return {
      success: response.ok,
      message: `API连接测试: ${response.status} - ${responseText.substring(0, 100)}`
    };
  } catch (error) {
    console.error('API连接测试失败:', error);
    return {
      success: false,
      message: `API连接测试失败: ${error instanceof Error ? error.message : '未知错误'}`
    };
  }
}

// 轮询支付状态
export async function pollPaymentStatus(
  payId: string, 
  onStatusChange: (status: PaymentStatus) => void,
  onComplete: (success: boolean) => void,
  maxAttempts: number = 30,
  interval: number = 2000
): Promise<void> {
  let attempts = 0;
  
  const poll = async () => {
    if (attempts >= maxAttempts) {
      console.log('轮询超时，停止查询');
      onStatusChange(PaymentStatus.FAILED);
      onComplete(false);
      return;
    }
    
    attempts++;
    console.log(`第${attempts}次查询支付状态`);
    
    const result = await queryPaymentStatus(payId);
    
    if (result.success && result.data) {
      console.log('查询结果:', result.data);
      
      // 检查多种可能的状态字段
      const status = result.data.status || result.data.payStatus || result.data.state || result.data.code;
      const isPaid = result.data.isPaid || result.data.paid || result.data.success;
      
      console.log('解析状态:', { status, isPaid, rawData: result.data });
      
      // 检查支付成功的各种可能状态
      if (status === 'success' || status === 'paid' || status === '1' || 
          isPaid === true || isPaid === 'true' || 
          result.data.message?.includes('成功') ||
          result.data.msg?.includes('成功')) {
        console.log('支付成功');
        onStatusChange(PaymentStatus.SUCCESS);
        onComplete(true);
        return;
      } else if (status === 'failed' || status === 'cancelled' || status === '0' || 
                 isPaid === false || isPaid === 'false') {
        console.log('支付失败或取消');
        onStatusChange(PaymentStatus.FAILED);
        onComplete(false);
        return;
      }
    }
    
    // 继续轮询
    setTimeout(poll, interval);
  };
  
  // 开始轮询
  poll();
}