const request=require('request')
//utility function to get Image or any data in buffer form with promise type
module.exports=function readURL(url){
	return new Promise((resolve,reject)=>{
		let buffer=[]
		request(url).on('data',chunk=>{
			buffer.push(chunk)
		}).on('close',()=>{
			resolve(Buffer.concat(buffer))
		}).on('error',()=>reject("something went wrong"))
	})
}