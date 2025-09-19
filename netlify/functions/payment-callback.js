const crypto = require('crypto');

exports.handler = async (event, context) => {
  console.log('=== 支付回调开始 ===');
  console.log('HTTP方法:', event.httpMethod);
  console.log('完整事件:', JSON.stringify(event, null, 2));

  // 只处理GET请求
  if (event.httpMethod !== 'GET') {
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
    const queryParams = event.queryStringParameters || {};
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
        body: 'Missing required parameters'
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

    // 这里可以添加您的业务逻辑，比如：
    // 1. 更新数据库中的订单状态
    // 2. 发送邮件通知
    // 3. 调用其他API
    // 4. 记录日志等

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
