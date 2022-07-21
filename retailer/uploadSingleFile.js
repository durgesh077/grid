const pinata = require('../pinata/pinata')
const { pinJson, pinImage } = require("../utils/ipfs")(pinata)
const web3 = require('../web3/web3')
const { signContent, recoverAccountNo } = require("../utils/signContent")(web3)
const warrantyCollection = require('../model/warranty')
module.exports = async (req, res) => {
    if (!req.session.userId) {
        res.status(404)
        res.send("-1")
        return
    }
    let imgBuffer = req.file.buffer
    let body = req.body
    let hashImage = await pinImage(imgBuffer, req.file.originalname)
    let imgUrl = `https://ipfs.io/ipfs/${hashImage.IpfsHash}`
    let content = {
        image: imgUrl,
        brand_name: body.brand_name,
        model_no: body.model_no,
        warranty_period: body.warranty_period,
        remarks: body.remarks.split(','),
        hashContent:body.hashContent||"tmp hash"
    }
    let hashJson = (await pinJson(content, content.brand_name + "_" + content.model_no)).IpfsHash
    let doc = new warrantyCollection({ CID: hashJson, brand_name: body.brand_name, model_no: body.model_no, userId: req.session.userId })
    doc = await doc.save()
    res.send(doc.id)
}