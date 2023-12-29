const { exchangeCFXs, accounts, cfxsExchangeContract } = require('./conflux');
const { address } = require('js-conflux-sdk');
const { waitMilliseconds, loadIndex,saveIndex,loadIDs,safeAddress} = require('./utils.js');

const STEP = 5;
const indexType="exchangeIndex"

async function handleAccount(account, ids) {
    let filename=safeAddress(account.address);
    let currentIndex = loadIndex(filename,indexType);
    for(let i = currentIndex; i <ids.length; i += STEP) {
        try {
            // prepare batch ids
            let exIds = [];
            for(let j = 0; j < STEP; j++) {
                if (i + j >= ids.length) break;
                let id = ids[i+j];
                if (id === '0') continue;
                let cfxsId = parseInt(id);
                let minted = await cfxsExchangeContract.minted(cfxsId);
                if (minted) {
                    console.log(`Id ${cfxsId} already exchanged`);
                    await waitMilliseconds(100);
                    currentIndex = i + j + 1; 
                    continue;
                }
                exIds.push(cfxsId);
            }
            if (exIds.length === 0) 
            {
                saveIndex(filename, currentIndex,indexType,0);
                continue;
            }
            console.log(`Exchange cfxs id ${exIds} to ${receiver}`);
            const receipt = await exchangeCFXs(account,exIds);
            console.log(`Result: ${receipt.outcomeStatus === 0 ? 'success' : 'fail'}`);
            if (receipt.outcomeStatus === 0) {
                currentIndex = i + STEP;
            }
            saveIndex(filename, currentIndex,indexType,0);
        } catch(e) {
            console.log('Exchange Error', e);
            await waitMilliseconds(500);
        }
    }
    console.log(account.address+" Finished");
    saveIndex(filename, currentIndex,indexType,1);
    
}
async function main() {
    await Promise.all(accounts.map(async (account) => {
        let mappedAddress = address.cfxMappedEVMSpaceAddress(account.address);
        console.log(account.address + " 映射地址: " + mappedAddress);
        let ids = await loadIDs(safeAddress(account.address),mappedAddress);
        return handleAccount(account, ids);
    }));
    console.log('Done');
}

main().catch(e => console.error(e));

