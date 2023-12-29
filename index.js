const { Conflux, address, Drip } = require('js-conflux-sdk');
const { ethers, Contract } = require("ethers");
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

const conflux = new Conflux({
    url: config.url,
    networkId: config.networkId,
});

const PRIVATE_KEYS = config.privateKeys;
const CrossSpaceCall = conflux.InternalContract('CrossSpaceCall');
const accounts = PRIVATE_KEYS.map(key => conflux.wallet.addPrivateKey(key));
const Gdrip = config.gasPrice;

// async function getAdjustedGasPrice() {
//     let currentGasPrice = await conflux.getGasPrice();


//     // 检查当前 Gas 价格是否超过上限
//     while (currentGasPrice/ BigInt(1e9) > GAS_PRICE_UPPER_LIMIT) {

//         await waitMilliseconds(RETRY_DELAY_MS); // 等待后重新获取
//         currentGasPrice = await conflux.getGasPrice();
//         console.log("currentGasPrice:",currentGasPrice/ BigInt(1e9))
//     }

//     let currentGDrip=currentGasPrice/ BigInt(1e9)+INCREMENT_GAS_PRICE_BY
//     return currentGDrip;

// }


function getBeijingTime() {
    let now = new Date();
    let localTime = now.getTime();
    let localOffset = now.getTimezoneOffset() * 60000; // 获取本地时间偏移的毫秒数
    let utc = localTime + localOffset;
    let offset = 8; // 中国时区偏移量为UTC+8
    let beijingTime = new Date(utc + (3600000 * offset));
    return beijingTime.toISOString().replace('T', ' ').replace('Z', '');
}



async function appendErrorToFile(accountAddress, message, transactionHash = '') {
    // 确保账户地址是安全的文件名
    let sanitizedAccountAddress = accountAddress.replace(/[<>:"\/\\|?*]+/g, '_');
    let logFileName = `${sanitizedAccountAddress}_errors.txt`;
    let timestamp = getBeijingTime(); // 获取北京时间
    let logMessage = `[${timestamp}]  Transaction Hash: ${transactionHash}, Message: ${message}\n`;

    // 确保日志文件的目录存在
    let logDir = 'logs'; // 假设所有日志都存储在一个叫做 'logs' 的目录下
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }

    // 完整的日志文件路径
    let logFilePath = path.join(logDir, logFileName);

    // 写入日志信息
    fs.appendFileSync(logFilePath, logMessage, 'utf8');
}


async function main() {
    // 对每个账户启动独立的循环
    accounts.forEach((account, index) => handleAccount(account, index));
}

async function handleAccount(account, accountIndex) {
    let round = 1;
    
    while (true) {
        try {
            
            console.log(`Account ${accountIndex} Balance ${balance} 轮次 ${round} start`);
            //await oneRound(account, accountIndex);
            
            round++;
        } catch (error) {
            await appendErrorToFile(account.address, error.message);
            console.error(`Error in account ${accountIndex}`);
        }
        await waitMilliseconds(1000);
    }
}


async function waitMilliseconds(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}




async function oneRound(account, accountIndex) {
    let hashes = [];
    let batch = 8;
    let nonce = await conflux.getNextNonce(account.address);
    let i;
    for (i = 0; i < batch; i++) {
        try {
            let currentNonce = nonce + BigInt(i);
            let hash = await CrossSpaceCall.transferEVM('0xc6e865c213c89ca42a622c5572d19f00d84d7a16').sendTransaction({
                from: account.address,
                nonce: currentNonce, // 使用更新后的 currentNonce
                gasPrice: Drip.fromGDrip(Gdrip)
            });
            hashes.push(hash);
        } catch (error) {
            console.log(`交易失败，账户 ${accountIndex}, nonce ${nonce + BigInt(i)}, 错误信息: ${error.message}`);
            await appendErrorToFile(account.address, error.message);
            break; // 如果一个交易失败，终止当前批次
        }
        await waitMilliseconds(500);
    }

    for (let j = 0; j < hashes.length; j++) {
        let hash = hashes[j];
        for (let k = 0; k < 30; k++) {
            try {
                let receipt = await conflux.getTransactionReceipt(hash);
                if (receipt) {
                    let gasFee = (Number(receipt.gasFee) / 1e18).toFixed(3);
                    console.log(`批次 ${j}, 账户 ${accountIndex}, 哈希 ${hash}, 使用的 Gas 费用: ${gasFee}`);
                    break;
                }
                await waitMilliseconds(1000);
            } catch (error) {
                await appendErrorToFile(account.address, error.message, hash);
                console.error(`获取批次 ${j}, 账户 ${accountIndex} 的收据时出错`);
                break; // 如果获取收据时出现错误，终止当前批次
            }
        }
    }

    // 为下一轮更新 nonce
    nonce += BigInt(batch);
}



main().catch(err => {
    console.error(err);
    process.exit(1);
});