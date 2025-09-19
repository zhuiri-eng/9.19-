# 支付回调配置说明

## 回调地址类型

### 1. 同步回调（returnUrl）
- **地址**：`https://statuesque-pastelito-3f8eae.netlify.app/payment/callback`
- **作用**：用户支付完成后，第三方支付平台跳转到此地址
- **特点**：用户能看到，用于显示支付结果
- **配置位置**：支付平台后台 → 同步回调地址

### 2. 异步回调（notifyUrl）
- **作用**：第三方支付平台服务器向您的系统发送支付通知
- **特点**：用户看不到，是服务器之间的通信
- **问题**：Netlify是静态网站，无法处理服务器端回调

## 异步回调解决方案

### 方案一：使用Webhook服务（推荐）
1. 访问 [webhook.site](https://webhook.site)
2. 获取唯一的webhook URL
3. 在 `src/services/paymentService.ts` 中替换 `notifyUrl`
4. 在支付平台后台配置此URL作为异步回调地址

### 方案二：使用Vercel Functions
1. 将项目部署到Vercel
2. 创建 `api/payment/callback.js` 文件
3. 处理异步回调逻辑

### 方案三：使用Netlify Functions
1. 在项目根目录创建 `netlify/functions/payment-callback.js`
2. 配置Netlify Functions
3. 使用 `https://statuesque-pastelito-3f8eae.netlify.app/.netlify/functions/payment-callback`

## 当前配置

```javascript
const PAYMENT_CONFIG = {
  callbackUrl: 'https://statuesque-pastelito-3f8eae.netlify.app/payment/callback', // 同步回调
  notifyUrl: 'https://webhook.site/your-unique-url', // 异步回调（需要替换）
};
```

## 支付平台配置

在支付平台后台配置：
- **同步回调地址**：`https://statuesque-pastelito-3f8eae.netlify.app/payment/callback`
- **异步回调地址**：根据选择的方案配置相应的URL

## 注意事项

1. 异步回调主要用于确认支付状态，避免支付成功但系统未更新的情况
2. 如果只有同步回调，用户支付完成后会跳转到结果页面
3. 建议配置异步回调以确保支付状态的准确性
