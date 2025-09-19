# 支付回调配置说明

## 回调地址类型

### 1. 同步回调（returnUrl）
- **地址**：`https://statuesque-pastelito-3f8eae.netlify.app/payment/callback`
- **作用**：用户支付完成后，第三方支付平台跳转到此地址
- **特点**：用户能看到，用于显示支付结果
- **触发条件**：使用 `isHtml=1` 时才会跳转
- **配置位置**：支付平台后台 → 同步回调地址

### 2. 异步回调（notifyUrl）
- **地址**：`https://statuesque-pastelito-3f8eae.netlify.app/.netlify/functions/payment-callback`
- **作用**：第三方支付平台服务器向您的系统发送支付通知
- **特点**：用户看不到，是服务器之间的通信
- **触发时机**：用户支付完成后立即发送GET请求
- **返回要求**：必须返回"success"字符串
- **重试机制**：24小时内会进行补偿请求

## 异步回调参数说明

### 接收参数
- `payId`：商户订单号
- `param`：创建订单时传入的参数
- `type`：支付方式（1=微信支付，2=支付宝支付）
- `price`：订单金额
- `reallyPrice`：实际支付金额
- `sign`：校验签名

### 签名验证
```
签名字符串 = payId + param + type + price + reallyPrice + 通讯密钥
签名 = md5(签名字符串)
```

## 当前配置

```javascript
const PAYMENT_CONFIG = {
  callbackUrl: 'https://statuesque-pastelito-3f8eae.netlify.app/payment/callback', // 同步回调
  notifyUrl: 'https://statuesque-pastelito-3f8eae.netlify.app/.netlify/functions/payment-callback', // 异步回调
};
```

## 支付平台配置

在支付平台后台配置：
- **同步回调地址**：`https://statuesque-pastelito-3f8eae.netlify.app/payment/callback`
- **异步回调地址**：`https://statuesque-pastelito-3f8eae.netlify.app/.netlify/functions/payment-callback`

## Netlify Functions 说明

项目已配置Netlify Functions来处理异步回调：
- **文件位置**：`netlify/functions/payment-callback.js`
- **功能**：验证签名、处理支付成功逻辑、返回"success"响应
- **日志**：所有回调请求都会记录在Netlify Functions日志中

## 注意事项

1. 异步回调主要用于确认支付状态，避免支付成功但系统未更新的情况
2. 如果只有同步回调，用户支付完成后会跳转到结果页面
3. 建议配置异步回调以确保支付状态的准确性
4. 异步回调必须返回"success"字符串，否则会被视为失败并重试
5. 通讯密钥必须与支付平台配置的一致
