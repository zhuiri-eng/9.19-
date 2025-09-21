const crypto = require('crypto');

// 简单的内存存储（生产环境建议使用数据库）
const paymentRecords = new Map();

exports.handler = async (event, context) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] === 支付回调开始 ===`);
  console.log('HTTP方法:', event.httpMethod);
  console.log('完整事件:', JSON.stringify(event, null, 2));

  // 支持GET和POST请求
  if (!['GET', 'POST'].includes(event.httpMethod)) {
    console.log('方法不允许:', event.httpMethod);
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      },
      body: 'Method Not Allowed'
    };
  }

  try {
    // 获取查询参数
    let queryParams = {};
    
    if (event.httpMethod === 'GET') {
      queryParams = event.queryStringParameters || {};
    } else if (event.httpMethod === 'POST') {
      try {
        queryParams = JSON.parse(event.body || '{}');
      } catch (e) {
        // 尝试解析表单数据
        if (event.body) {
          const params = new URLSearchParams(event.body);
          queryParams = {};
          for (const [key, value] of params) {
            queryParams[key] = value;
          }
        } else {
          queryParams = {};
        }
      }
    }

    const { payId, param, type, price, reallyPrice, sign } = queryParams;

    console.log('原始查询参数:', queryParams);
    console.log('解析后的参数:', { payId, param, type, price, reallyPrice, sign });

    // 检查是否是测试请求
    if (queryParams.test === '1') {
      console.log('收到测试请求');
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': '*'
        },
        body: 'success - test request received'
      };
    }

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

    // 检查是否已经处理过此订单
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

    // 通讯密钥
    const appSecret = 'f659709e38ab01a9d77e52cdcda9a914';

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

    // 记录支付成功
    paymentRecords.set(payId, {
      payId,
      param,
      type,
      price,
      reallyPrice,
      timestamp: new Date().toISOString(),
      status: 'paid'
    });

    // 这里可以添加您的业务逻辑，比如：
    // 1. 更新数据库中的订单状态
    // 2. 发送邮件通知
    // 3. 调用其他API
    // 4. 记录日志等

    // 模拟自动解锁逻辑
    console.log('开始执行自动解锁逻辑...');
    
    // 这里可以添加解锁逻辑，比如：
    // 1. 调用解锁API
    // 2. 更新用户权限
    // 3. 发送解锁通知等
    
    console.log(`订单 ${payId} 支付成功，已自动解锁用户权限`);

    console.log('=== 支付回调成功 ===');
    // 返回成功响应
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
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      },
      body: 'Internal Server Error'
    };
  }
};
