let contractPromise = require("../web3/contractConnect")
const web3 = require('../web3/web3')
async function getHistory(sNo) {
    let ret;
    try {
        let {contract} = await contractPromise
        let data = await contract.getPastEvents('Mint', {
            fromBlock: 0
        })
        let sha3Hash = web3.utils.sha3(sNo)
        data = data.filter(d =>
            d.returnValues['serial_no'] === sha3Hash
        )
        let histData = await Promise.all(data.map(async (d) => {
            let timestamp = (await web3.eth.getBlock(d.blockNumber)).timestamp * 1000;
            let date = new Date(timestamp).toLocaleDateString()
            let to = d.returnValues.to
            return [
                ["purchased by", to],
                ['date', date],
                ['time', new Date(timestamp).toLocaleTimeString()],
            ]
        }))
        ret = histData
    } catch (err) {
        console.log(err)
        return []
    }


    try {
        let {contract} = await contractPromise
        let data = await contract.getPastEvents('Transfer', {
            fromBlock: 0
        })
        let sha3Hash = web3.utils.sha3(sNo)
        data = data.filter(d =>
            d.returnValues['serial_no'] === sha3Hash
        )
        let histData = await Promise.all(data.map(async (d) => {
            let timestamp = (await web3.eth.getBlock(d.blockNumber)).timestamp * 1000;
            let date = new Date(timestamp).toLocaleDateString()
            let [transfer_from, transfer_to] = [d.returnValues.from, d.returnValues.to]
            return [
                ["transfer_from", transfer_from],
                ['transfer_to', transfer_to],
                ['date', date],
                ['time', new Date(timestamp).toLocaleTimeString()]
            ]
        }))
        return [...ret, ...histData]
    } catch (err) {
        console.log(err)
        return []
    }
}
module.exports = getHistory