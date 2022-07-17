const request=require('request')
const fs=require('fs')
const {fs:memfs,vol}=require('memfs')
//wrapper function 
module.exports=function (pinata){
	//function to upload JSON file onto IPFS
	async function pinJson(json,name){
		try{
		let res=await pinata.pinJSONToIPFS(json,{
				pinataMetadata:{
					name
				}
			})
		return res
		}catch (msg){
			console.log(msg)
		}
	}

	async function pinImage(buffer,name){
		try{
		memfs.writeFileSync("/tempFile",buffer)
		let readStream=memfs.createReadStream('/tempFile')
		let data=await pinata.pinFileToIPFS(readStream,{
			pinataMetadata:{
				name:name
			}
		})
		vol.reset()
		return data
		}catch (msg){
			console.log(msg)
		}
	}

	return {pinImage,pinJson}
}


//for pinning image which expects buffer of image/any data as input
