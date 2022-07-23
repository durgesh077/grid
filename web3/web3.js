const HDWalletProvider = require("@truffle/hdwallet-provider")
const Web3 = require("web3")
let Mnemonic = process.env.Mnemonic
let infura_api = process.env.infura_api
let provider = new HDWalletProvider({
	mnemonic: Mnemonic,
	providerOrUrl: infura_api
}
)
//provider = new HDWalletProvider({
	//	mnemonic: "embody city year describe shop lobster melt dawn success offer glass ignore",
	//	providerOrUrl: "http://localhost:8545"
	//})
	
module.exports = new Web3(provider)
