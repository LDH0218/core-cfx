
## 多钱包归集CFXs

1. 安装 node.js 环境
2. npm install
3. 修改 config.json 文件的 `privateKeys` 填入私钥，`receiver`填入最终的归集钱包
4. 先将旧的转化为新的CFXs启动脚本  `node exchangeCfxs.js`
4. 再将新的CFXs归集`node transferCfxs.js`

### 说明

1. 账号越多，对rpc的要求越高。
2. 遇到报错，多次重复运行即可。
3. 在exchangeIndex，transferIndex文件夹中可看到各个地址的进度，最好先将全部CFXs换成新的，再归集，如果最后发现数量对不上，重复运行即可。
4. 可修改config.json文件中的`gasPrice`调整gas。

