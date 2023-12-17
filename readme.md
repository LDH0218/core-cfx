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
   
4. 此项目基于模仿和chagpt开发而成，遇到bug请大家谅解。
   
## 获取映射地址

```shell
node getMapAddress.js
```
