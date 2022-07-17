const HDWalletProvider=require("@truffle/hdwallet-provider")
const Web3=require("web3")
let Mnemonic=process.env.Mnemonic
let infura_api=process.env.infura_api
let provider=new HDWalletProvider({
	mnemonic:Mnemonic,
	providerOrUrl:infura_api}
	)
module.exports=new Web3(provider)
