module.exports=function signerFunction(web3){
	async function signContent(content,accountNo){
		try{
		  if(!accountNo){
		  	accountNo=(await web3.eth.getAccounts())[0]
		  }
		let hash=await web3.utils.keccak256(JSON.stringify(content))
		let signContent=await web3.eth.personal.sign(hash,accountNo)
		return signContent
		}catch(err){
			console.log(err.message)
			return -1
		}
	}
	async function recoverAccountNo(content,signedContent){
		try{
		let hash = await  web3.utils.keccak256(JSON.stringify(content))
		let acc=await web3.eth.personal.ecRecover(hash,signedContent)
		return acc
		}catch(err){
			console.log(err.message)
			return -1
		}
	}
	return {signContent,recoverAccountNo}
}