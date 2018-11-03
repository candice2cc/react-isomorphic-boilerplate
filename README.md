### 架构
- react ssr
- code split
- 数据接口proxy模式

### 工程化
- 浏览器端dev模式：react spa
> webpack-dev-server开启浏览器端服务
```bash
npm run dev-client
```

- node端dev模式：代理api服务
```bash
npm run dev-server
```

- 构建前后端代码

client:react spa

server:react ssr
```bash
npm run build
```

- 启动服务
```
npm start

pm2 start process.json

pm2 start process.json --env production
```

### 注意事项
- 移动端尽量使用体积小的库
- 考虑兼容性
- 性能压测
