const express=require("express")
const multer =require('multer')
const pinata=require('../pinata/pinata')
const {pinJson,pinImage}=require("../utils/ipfs")(pinata)
const web3=require('../web3/web3')
const {signContent,recoverAccountNo}=require("../utils/signContent")(web3)
const warrantyCollection = require('../model/warranty')
const router=express.Router()
// const bodyParser=require('body-parser')
const storage = multer.memoryStorage()

const upload = multer({ storage: storage })

router.post("/uploadMetadata",upload.single("image"),async(req,res)=>{
	let imgBuffer=req.file.buffer
	let body=req.body
	let signedData;
	let hashImage=await pinImage(imgBuffer,req.file.originalname)
	let imgUrl=`https://ipfs.io/ipfs/${hashImage.IpfsHash}`
	let content={
		image:imgUrl,
		brand_name:body.brand_name,
		model_no:body.model_no,
		warranty_period:body.warranty_period,
		remarks:body.remarks.split(',')
	}
	let hashJson=(await pinJson(content,content.brand_name+"_"+content.model_no)).IpfsHash
	let signedContent=await signContent(hashJson)
	let doc = new warrantyCollection({CID:hashJson,signedCID:signedContent,brand_name:body.brand_name,model_no:body.model_no})
	console.log(doc)
	doc=await doc.save()
	res.send(doc.id)
})

module.exports=router