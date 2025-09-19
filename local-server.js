const express = require('express');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = 3003;

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// 支付回调处理函数
app.get('/.netlify/functions/payment-callback', (req, res) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 收到异步回调请求`);
  console.log('查询参数:', req.query);

  const { payId, param, type, price, reallyPrice, sign } = req.query;

  // 验证必要参数
  if (!payId || !param || !type || !price || !reallyPrice || !sign) {
    console.error('缺少必要参数');
    return res.status(400).send('error_params');
  }

  // 通讯密钥
  const appSecret = 'f659709e38ab01a9d77e52cdcda9a914';

  // 验证签名
  const signString = `${payId}${param}${type}${price}${reallyPrice}${appSecret}`;
  const calculatedSign = crypto.createHash('md5').update(signString).digest('hex');

  console.log('签名字符串:', signString);
  console.log('计算签名:', calculatedSign);
  console.log('接收签名:', sign);
  console.log('签名匹配:', calculatedSign === sign);

  if (calculatedSign !== sign) {
    console.error('签名验证失败');
    return res.status(400).send('error_sign');
  }

  // 签名验证通过，处理业务逻辑
  console.log('支付成功回调处理:', {
    商户订单号: payId,
    自定义参数: param,
    支付方式: type === '1' ? '微信支付' : '支付宝支付',
    订单金额: price,
    实际支付金额: reallyPrice
  });

  console.log('=== 支付回调成功 ===');
  res.send('success');
});

// 同步回调处理
app.get('/payment/callback', (req, res) => {
  const { type, payId } = req.query;
  console.log('收到同步回调请求:', { type, payId });
  
  res.send(`
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>支付回调成功</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .success { color: #28a745; }
            .info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <h1 class="success">✅ 支付回调成功！</h1>
        <div class="info">
            <p><strong>回调类型：</strong>${type === 'return' ? '同步回调' : '异步回调'}</p>
            <p><strong>订单号：</strong>${payId || '未知'}</p>
            <p><strong>时间：</strong>${new Date().toLocaleString()}</p>
        </div>
        <p>回调处理完成，可以关闭此页面。</p>
    </body>
    </html>
  `);
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 本地测试服务器已启动！`);
  console.log(`📱 主网站: http://localhost:${PORT}`);
  console.log(`🔧 异步回调: http://localhost:${PORT}/.netlify/functions/payment-callback`);
  console.log(`🔧 同步回调: http://localhost:${PORT}/payment/callback`);
  console.log(`\n📋 测试步骤:`);
  console.log(`1. 打开 http://localhost:${PORT}`);
  console.log(`2. 测试支付功能`);
  console.log(`3. 使用回调测试工具验证回调地址`);
});
