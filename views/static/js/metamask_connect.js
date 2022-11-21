const contractAddress ='0x408f08eC1deEdfEB967d29912e894fc16187c221';
const ABI=[
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "string",
                    "name": "serial_no",
                    "type": "string"
                }
            ],
            "name": "Burned",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint64",
                    "name": "to",
                    "type": "uint64"
                },
                {
                    "indexed": true,
                    "internalType": "string",
                    "name": "serial_no",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "uint64",
                    "name": "tokenNo",
                    "type": "uint64"
                }
            ],
            "name": "Mint",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint64",
                    "name": "from",
                    "type": "uint64"
                },
                {
                    "indexed": true,
                    "internalType": "uint64",
                    "name": "to",
                    "type": "uint64"
                },
                {
                    "indexed": true,
                    "internalType": "string",
                    "name": "serial_no",
                    "type": "string"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "uint64",
                    "name": "_mobile_no",
                    "type": "uint64"
                },
                {
                    "internalType": "string",
                    "name": "_serial_no",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_cid",
                    "type": "string"
                },
                {
                    "internalType": "uint64",
                    "name": "_startAfter",
                    "type": "uint64"
                }
            ],
            "name": "mintWarrantyCardNFT",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_serial_no",
                    "type": "string"
                }
            ],
            "name": "burnWarrantyCardNFT",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "succeeded",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint64",
                    "name": "from",
                    "type": "uint64"
                },
                {
                    "internalType": "uint64",
                    "name": "to",
                    "type": "uint64"
                },
                {
                    "internalType": "string",
                    "name": "_serial_no",
                    "type": "string"
                }
            ],
            "name": "sendOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_serial_no",
                    "type": "string"
                }
            ],
            "name": "getSerialNoOwnerMobileNo",
            "outputs": [
                {
                    "internalType": "uint64",
                    "name": "mobileNo",
                    "type": "uint64"
                }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
        },
        {
            "inputs": [
                {
                    "internalType": "uint64",
                    "name": "_mobile_no",
                    "type": "uint64"
                },
                {
                    "internalType": "string",
                    "name": "_serial_no",
                    "type": "string"
                }
            ],
            "name": "getNFTFor",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "uint64",
                            "name": "startTimestamp",
                            "type": "uint64"
                        },
                        {
                            "internalType": "uint64",
                            "name": "startAfter",
                            "type": "uint64"
                        },
                        {
                            "internalType": "string",
                            "name": "serial_no",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "cid",
                            "type": "string"
                        }
                    ],
                    "internalType": "struct Warranty.nft",
                    "name": "NFT",
                    "type": "tuple"
                }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
        }
    ]

let contract;
let web3;
let accountNumber;
	new Promise((resolve,reject)=>{
		try{
			resolve(ethereum)
		}catch {
			reject("not found")
		}
	}).then(data=>{
		return ethereum.request({method:"eth_requestAccounts"})
	})
	.then(accounts=>{
		accountNumber=accounts[0];
		web3 = new Web3(ethereum) 
	}).catch (err=>{
	web3=new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
	console.log(web3)
	}).then(
	()=>{
		let ethereums={
			"3":"ropsten",
			"4":"rinkyby",
			"1337":"ganache",
            "11155111": "goerli",
            "5": "sepolia"
		}
		if (web3)
			contract = new web3.eth.Contract(ABI, contractAddress);
		(async () => {
			accountNumber=(await web3.eth.getAccounts())[0]
			console.log(ethereums[await web3.eth.getChainId()] || "other")
			afterConnection();
		}
		)()
	}
)
.catch(err=>{
	web3 = null;
	console.log("unable to connect <" + err.message + ">");
});