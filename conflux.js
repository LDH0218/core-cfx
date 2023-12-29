const { Conflux, Drip } = require('js-conflux-sdk');
const CONFIG = require('./config.json');
const {
    cfxsMainContract,
    cfxsContract,
    cfxsExchangeContract,
    provider,
    getWallet,
} = require('./espace/eSpace');

// core space sdk init
const conflux = new Conflux({
    url: CONFIG.url,
    networkId: CONFIG.networkId,
});

const CrossSpaceCall = conflux.InternalContract('CrossSpaceCall');

const privateKeys = CONFIG.privateKeys;
const accounts = privateKeys.map(key => conflux.wallet.addPrivateKey(key));
const receiver=CONFIG.receiver;
const Gdrip=CONFIG.gasPrice
async function transferCFXs(account,cfxsIds) {
    if (!cfxsIds || !receiver) {
        throw new Error('Invalid Inputs');
    }
    const data = cfxsMainContract.interface.encodeFunctionData('transfer(uint[],address)', [cfxsIds, receiver]);
    const receipt = await CrossSpaceCall.callEVM(CONFIG.newCfxs, data).sendTransaction({
        from: account.address,
        gasPrice: Drip.fromGDrip(Gdrip)
    }).executed();

    return receipt;
}

async function exchangeCFXs(account,cfxsIds = []) {
    if (!cfxsIds || cfxsIds.length === 0) return null;

    const data = cfxsExchangeContract.interface.encodeFunctionData('ExTestToMain', [cfxsIds]);
    
    const receipt = await CrossSpaceCall.callEVM(CONFIG.exchangeContract, data).sendTransaction({
        from: account.address,
        gasPrice: Drip.fromGDrip(Gdrip)
    }).executed();

    return receipt;
}

module.exports = {
    conflux,
    accounts,
    CrossSpaceCall,
    Drip,
    transferCFXs,
    cfxsContract,
    exchangeCFXs,
    cfxsExchangeContract,
    cfxsMainContract,
    provider,
    getWallet,
}