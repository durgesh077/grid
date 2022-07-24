let contract=require("../web3/contractConnect")
const web3=require('../web3/web3')
async function getHistory(sNo){
    contract=await contract
    let data = await contract.getPastEvents('Transfer',{
        fromBlock:0,
        serial_no: await web3.utils.sha3(sNo)
    })
    let histData=await Promise.all(data.map(async(d)=>{
        let timestamp =(await web3.eth.getBlock(d.blockNumber)).timestamp*1000;
        let date=new Date(timestamp).toLocaleDateString()
        let [transfer_from,transfer_to]=[d.returnValues.from,d.returnValues.to]
        return [
            ['date',date],
            ["transfer_from", transfer_from],
            ['transfer_to', transfer_to]
        ]
    }))
    return histData
}
module.exports=getHistory