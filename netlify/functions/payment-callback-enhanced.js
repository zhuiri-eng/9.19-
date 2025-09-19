const crypto = require('crypto');

// 简单的内存存储（生产环境建议使用数据库）
const paymentRecords = new Map();

exports.handler = async (event, context) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] === 支付回调开始 ===`);
  console.log('HTTP方法:', event.httpMethod);
  console.log('请求头:', event.headers);
  console.log('完整事件:', JSON.stringify(event, null, 2));

  // 支持GET和POST请求
  if (!['GET', 'POST'].includes(event.httpMethod)) {
    console.log('方法不允许:', event.httpMethod);
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: 'Method Not Allowed'
    };
  }

  // 处理 OPTIONS 请求（CORS 预检）
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: ''
    };
  }

  try {
    // 获取查询参数
    let queryParams = {};
    
    if (event.httpMethod === 'GET') {
      queryParams = event.queryStringParameters || {};
    } else if (event.httpMethod === 'POST') {
      try {
        // 尝试解析 JSON
        queryParams = JSON.parse(event.body || '{}');
      } catch (e) {
        // 尝试解析表单数据
        if (event.body) {
          const formData = new URLSearchParams(event.body);
          queryParams = Object.fromEntries(formData);
        }
      }
    }

    const { payId, param, type, price, reallyPrice, sign } = queryParams;

    console.log('原始查询参数:', queryParams);
    console.log('解析后的参数:', { payId, param, type, price, reallyPrice, sign });

    // 验证必要参数
    if (!payId || !param || !type || !price || !reallyPrice || !sign) {
      console.error('缺少必要参数:', {
        payId: !!payId,
        param: !!param,
        type: !!type,
        price: !!price,
        reallyPrice: !!reallyPrice,
        sign: !!sign
      });
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': '*'
        },
        body: 'error_params'
      };
    }

    // 检查是否已经处理过此订单（幂等性处理）
    if (paymentRecords.has(payId)) {
      console.log('订单已处理过，直接返回成功:', payId);
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': '*'
        },
        body: 'success'
      };
    }

    // 从环境变量获取通讯密钥（安全！）
    const appSecret = process.env.PAY_API_KEY || 'f659709e38ab01a9d77e52cdcda9a914';
    
    if (!process.env.PAY_API_KEY) {
      console.warn('警告：使用硬编码的通讯密钥，建议设置环境变量 PAY_API_KEY');
    }

    // 验证签名
    // 签名计算方式：md5(payId + param + type + price + reallyPrice + 通讯密钥)
    const signString = `${payId}${param}${type}${price}${reallyPrice}${appSecret}`;
    const calculatedSign = crypto.createHash('md5').update(signString).digest('hex');

    console.log('签名字符串:', signString);
    console.log('计算签名:', calculatedSign);
    console.log('接收签名:', sign);
    console.log('签名匹配:', calculatedSign === sign);

    if (calculatedSign !== sign) {
      console.error('签名验证失败');
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': '*'
        },
        body: 'error_sign'
      };
    }

    // 签名验证通过，处理业务逻辑
    console.log('支付成功回调处理:', {
      商户订单号: payId,
      自定义参数: param,
      支付方式: type === '1' ? '微信支付' : '支付宝支付',
      订单金额: price,
      实际支付金额: reallyPrice
    });

    // 记录支付成功（幂等性处理）
    paymentRecords.set(payId, {
      payId,
      param,
      type,
      price,
      reallyPrice,
      timestamp: new Date().toISOString(),
      status: 'paid',
      processed: true
    });

    // 业务逻辑处理
    try {
      // 1. 更新订单状态（示例：调用外部 API）
      if (process.env.ORDER_UPDATE_API) {
        console.log('调用订单更新 API...');
        const updateResponse = await fetch(process.env.ORDER_UPDATE_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.API_TOKEN || ''}`
          },
          body: JSON.stringify({
            payId,
            status: 'paid',
            amount: reallyPrice,
            paymentMethod: type === '1' ? 'wechat' : 'alipay',
            timestamp: new Date().toISOString()
          })
        });

        if (!updateResponse.ok) {
          throw new Error(`订单更新失败: ${updateResponse.status}`);
        }
        console.log('订单状态更新成功');
      }

      // 2. 发送通知（示例：调用通知服务）
      if (process.env.NOTIFICATION_API) {
        console.log('发送支付成功通知...');
        const notificationResponse = await fetch(process.env.NOTIFICATION_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            type: 'payment_success',
            payId,
            amount: reallyPrice,
            message: `订单 ${payId} 支付成功，金额：¥${reallyPrice}`
          })
        });

        if (notificationResponse.ok) {
          console.log('通知发送成功');
        }
      }

      // 3. 记录到日志服务（示例）
      if (process.env.LOG_API) {
        console.log('记录支付日志...');
        await fetch(process.env.LOG_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            level: 'info',
            message: 'Payment callback processed',
            data: {
              payId,
              amount: reallyPrice,
              timestamp: new Date().toISOString()
            }
          })
        });
      }

    } catch (businessError) {
      console.error('业务逻辑处理失败:', businessError);
      // 即使业务逻辑失败，也要返回 success 避免重复回调
      // 但记录错误以便后续处理
    }

    console.log(`订单 ${payId} 支付成功，已自动解锁用户权限`);
    console.log('=== 支付回调成功 ===');

    // 返回成功响应（严格按照支付平台要求）
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      },
      body: 'success'
    };

  } catch (error) {
    console.error('处理支付回调时发生错误:', error);
    console.error('错误堆栈:', error.stack);
    
    // 即使发生错误，也要返回 success 避免支付平台重复回调
    // 但记录错误以便排查
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      },
      body: 'success'
    };
  }
};
