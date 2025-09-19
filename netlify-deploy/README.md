# Netlify 部署包

这个文件夹包含了可以直接部署到 Netlify 的所有文件。

## 📁 文件结构

```
netlify-deploy/
├── index.html                    # 主页面
├── payment-test.html            # 简化版测试页面
├── test-callback-advanced.html  # 高级版测试页面
├── assets/                      # 静态资源
│   ├── main-*.js               # JavaScript 文件
│   └── main-*.css              # CSS 文件
├── .netlify/                   # Netlify Functions
│   └── functions/
│       └── payment-callback.js # 支付回调处理函数
└── netlify.toml                # Netlify 配置文件
```

## 🚀 部署方法

### 方法1：拖拽部署（推荐）

1. 打开 [Netlify](https://netlify.com)
2. 登录您的账户
3. 将整个 `netlify-deploy` 文件夹拖拽到 Netlify 的部署区域
4. 等待部署完成

### 方法2：手动上传

1. 登录 Netlify 控制台
2. 选择 "Deploys" 标签
3. 点击 "Deploy manually" 或 "Browse to upload"
4. 选择 `netlify-deploy` 文件夹中的所有文件
5. 等待部署完成

## 🌐 访问地址

部署完成后，您可以通过以下地址访问：

- **主网站**：`https://your-site-name.netlify.app/`
- **简化版测试页面**：`https://your-site-name.netlify.app/payment-test.html`
- **高级版测试页面**：`https://your-site-name.netlify.app/test-callback-advanced.html`

## 🔧 支付回调配置

部署完成后，请在支付平台后台配置以下回调地址：

### 异步回调地址（notifyUrl）
```
https://your-site-name.netlify.app/.netlify/functions/payment-callback
```

### 同步回调地址（returnUrl）
```
https://your-site-name.netlify.app/payment/callback
```

## 📋 功能特性

- ✅ **完整的支付系统**：支持微信支付和支付宝支付
- ✅ **二维码直接显示**：无需跳转，在当前页面显示支付二维码
- ✅ **自动解锁功能**：支付成功后自动解锁用户权限
- ✅ **回调处理**：完整的同步和异步回调处理
- ✅ **测试工具**：内置测试页面验证支付功能
- ✅ **响应式设计**：支持各种设备访问

## 🧪 测试步骤

1. 访问测试页面
2. 点击"检查回调状态"
3. 点击"测试回调"
4. 验证支付功能是否正常

## 📞 技术支持

如有问题，请检查：
1. Netlify Functions 是否正常部署
2. 回调地址是否正确配置
3. 支付平台参数是否正确
