# 🚀 Render 部署指南

## 部署步骤

### 1. 访问 Render 网站
- 打开 [https://render.com](https://render.com)
- 使用 GitHub 账号登录

### 2. 创建新服务
- 点击 "New +" 按钮
- 选择 "Web Service"
- 连接您的 GitHub 仓库：`zhuiri-eng/9.19-`

### 3. 配置服务
- **Name**: `payment-app` (或您喜欢的名称)
- **Environment**: `Node`
- **Region**: `Oregon (US West)`
- **Branch**: `master`
- **Root Directory**: 留空
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### 4. 环境变量
添加以下环境变量：
- `NODE_ENV`: `production`

### 5. 部署
- 点击 "Create Web Service"
- 等待部署完成（大约 5-10 分钟）

## 部署后的配置

### 获取 Render 应用 URL
部署完成后，您会得到一个类似这样的 URL：
```
https://your-app-name.onrender.com
```

### 更新支付服务配置
在 `src/services/paymentService.ts` 中更新回调地址：

```typescript
const PAYMENT_CONFIG = {
  // ... 其他配置
  callbackUrl: 'https://your-app-name.onrender.com/callback',
  notifyUrl: 'https://your-app-name.onrender.com/payment-callback',
  // ... 其他配置
};
```

### 蓝鲸支付后台配置
在蓝鲸支付后台设置以下回调地址：

**同步回调地址（returnUrl）：**
```
https://your-app-name.onrender.com/callback
```

**异步回调地址（notifyUrl）：**
```
https://your-app-name.onrender.com/payment-callback
```

**通讯密钥：**
```
f659709e38ab01a9d77e52cdcda9a914
```

## 测试部署

### 1. 健康检查
访问：`https://your-app-name.onrender.com/health`
应该返回：`{"status":"ok","timestamp":"..."}`

### 2. 测试回调
访问：`https://your-app-name.onrender.com/callback?test=1`
应该显示支付回调成功页面

### 3. 测试异步回调
访问：`https://your-app-name.onrender.com/payment-callback?test=1`
应该返回：`success`

## 优势

1. **无 CDN 限制**：Render 不会拦截回调请求
2. **服务器端处理**：可以正确处理异步回调
3. **自动部署**：GitHub 推送后自动重新部署
4. **免费计划**：适合开发和测试

## 注意事项

1. **免费计划限制**：应用在 15 分钟无活动后会休眠
2. **冷启动**：休眠后首次访问需要几秒钟启动
3. **域名**：免费计划使用 `.onrender.com` 域名

## 故障排除

### 部署失败
- 检查 `package.json` 中的依赖
- 确保所有文件都已提交到 GitHub
- 查看 Render 的构建日志

### 回调不工作
- 检查回调地址是否正确
- 确认蓝鲸支付后台配置
- 查看 Render 的应用日志

### 应用休眠
- 免费计划会在 15 分钟无活动后休眠
- 首次访问需要等待几秒钟启动
- 考虑升级到付费计划避免休眠
