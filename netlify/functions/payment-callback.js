const crypto = require('crypto');

exports.handler = async (event, context) => {
  // 只处理GET请求
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  try {
    // 获取查询参数
    const { payId, param, type, price, reallyPrice, sign } = event.queryStringParameters || {};

    console.log('收到支付回调:', { payId, param, type, price, reallyPrice, sign });

    // 验证必要参数
    if (!payId || !param || !type || !price || !reallyPrice || !sign) {
      console.error('缺少必要参数');
      return {
        statusCode: 400,
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

    if (calculatedSign !== sign) {
      console.error('签名验证失败');
      return {
        statusCode: 400,
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

    // 返回成功响应
    return {
      statusCode: 200,
      body: 'success'
    };

  } catch (error) {
    console.error('处理支付回调时发生错误:', error);
    return {
      statusCode: 500,
      body: 'Internal Server Error'
    };
  }
};
