# corecfxs

本脚本在基础上进行修改可以通过跨 space 打铭文

https://github.com/0x01010110/corecfxs

## 使用方法

1. 安装 node.js 环境

2. npm install

3. 修改 config.json 文件的 `PRIVATE_KEYS` 填入私钥. 需要确保账户里有足够的 CFX 用于支付手续费 

4. 修改合适的`GDrip`，目前采用固定的GDrip, 可在配置文件中配置，具体的数值可以参考这个网站看实时的GDrip

   https://confluxscan.io/address/cfx:aaejuaaaaaaaaaaaaaaaaaaaaaaaaaaaa2sn102vjv

5. 启动脚本  `node index.js`

  

### 说明

1. 如果出现报错，大概率是GDrip给低了或者rpc网络拥堵导致的，根据我的测试即使报错实际成本也和链上差不多。继续运行即可。
2. 这里可以注册免费的私人节点。
https://console.unifra.io/
3. 可以多个账号同时打格式为 "PRIVATE_KEYS": ["0x你的私钥1","0x你的私钥2","0x你的私钥3" ]
4. 此项目基于模仿和chagpt开发，bug较多请大家谅解。
5. 打到的铭文在 Core 空间账户的 eSpace 映射地址中
6. 将来铭文取出需要通过跨 space 调用(通过工具)来操作会有人开发。
7. 在 Core 空间打 cfxs 花费的 gas 是 eSpace 同样交易的 10 倍， 前期 core 这个 gas 价格低的情况下有优势，如果两边的价格都涨至相同的价位， 则 Core 的手续费更贵.
   
## 获取映射地址

```shell
node getMapAddress.js
```
