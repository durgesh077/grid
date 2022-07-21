const web3 = require('./web3')
const fs = require('fs')

let warrantyFile = fs.readFileSync('src/artifacts/contracts/Warranty_less_data.json')
let warrantyJson = JSON.parse(warrantyFile)
let contractABI = warrantyJson.abi;
module.exports = (async () => {
    let networkId = await web3.eth.net.getId()
    let address = warrantyJson.networks[networkId].address
    let accs = await web3.eth.getAccounts()
    let acc = accs[0]
    let contract = new web3.eth.Contract(contractABI, address, {
        from: acc
    })
    return contract
})()

