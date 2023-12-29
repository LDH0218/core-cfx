const axios = require('axios');
const fs = require('fs');
async function waitMilliseconds(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getNewCfxsIds(_addr) {
    let ids = [];
    const limit = 1000;
    let startIndex = 0;
    while(true) {
        let { data: {count, rows} } = await axios.get(`http://test.conins.io/newlist?owner=${_addr}&startIndex=${startIndex}&size=${limit}`);
        ids = ids.concat(rows.map(item => item.id));
        if (rows.length < limit) {
            break;
        }
        startIndex += limit;
    }
    return ids;
}



async function getIDs(_addr) {
    let ids = [];
    const limit = 1000;
    let startIndex = 0;
    while(true) {
        let { data: {count, rows} } = await axios.get(`http://test.conins.io/oldlist?owner=${_addr}&startIndex=${startIndex}&size=${limit}`);
        ids = ids.concat(rows.map(item => item.id));
        if (rows.length < limit) {
            break;
        }
        startIndex += limit;
    }
    return ids;
}

async function getIDsFromAnother(_addr) {
    let { data } = await axios.get(`http://110.41.179.168:8088/?address=${_addr}`);   
    return data;
}
function safeAddress(address) {
    // 使用正则表达式将冒号替换为下划线
    const safeAddress = address.replace(/:/g, '_');
    return safeAddress;
}
function loadIndex(address, indexType) {
    try {
        let indexFile = `./${indexType}/${address}.json`;
        if (fs.existsSync(indexFile)) {
            return JSON.parse(fs.readFileSync(indexFile, 'utf-8'));
        } else {
            fs.writeFileSync(indexFile, JSON.stringify(0), 'utf-8');
        }
    } catch (e) {
        console.error(`Error reading last checked ${indexType} index file for address ${address}:`, e);
    }
    return 0;
}

function saveIndex(address, index, indexType,over) {
    try {
        let indexFile = `./${indexType}/${address}.json`;
        if(over) fs.writeFileSync(indexFile, JSON.stringify(0), 'utf-8');
        else fs.writeFileSync(indexFile, JSON.stringify(index), 'utf-8'); 
    } catch (e) {
        console.error(`Error saving last checked ${indexType} index file for address ${address}:`, e);
    }
}

async function loadIDs(address,mappedAddress){
    let indexFile = `./IDs/${address}.json`;
    let ids;
    if (fs.existsSync(indexFile)) {
        ids = JSON.parse(fs.readFileSync(indexFile, 'utf-8'));
    } else {
        ids = await getIDsFromAnother(mappedAddress);
        fs.writeFileSync(indexFile, JSON.stringify(ids), 'utf-8');
    }
    return ids;
}

module.exports = {
    getIDsFromAnother,
    getIDs,
    getNewCfxsIds,
    waitMilliseconds,
    loadIDs,
    loadIndex,
    saveIndex,
    safeAddress
};