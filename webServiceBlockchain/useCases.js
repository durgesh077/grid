const express = require("express")
const bodyParser = require('body-parser')
const router = express.Router()
let contractPromise = require("../web3/contractConnect")
const readURL = require("../utils/utility")
let { sendOTP, verifyOTP } = require('../utils/validateToTransfer')
const pdfGenerator = require("../utils/pdfGenerator")
const genPDF = require("../utils/pdfGenerator")
const getHistory = require("../utils/history")
const minterModel = require("../model/minter")
const oneDay = 24 * 60 * 60 * 1000
const oneMonth = 30 * oneDay

router.use(bodyParser.urlencoded({ extended: false }))

router.get('/sendNFT', (req, res) => {
    res.render('../views/transferNFT')
})
router.post('/OTPForTransferNFT', async (req, res) => {
    let contract = await contractPromise;
    let { from_mobile_no, to_mobile_no, serial_no } = req.body;
    let sent = await sendOTP(from_mobile_no, to_mobile_no, serial_no)
    if (!sent) {
        res.status(404)
        res.send("Failed")
        return
    }


    res.send("sent")
})

router.post('/transferNFT', async (req, res) => {
    let contract = await contractPromise;
    let { from_mobile_no, to_mobile_no, serial_no, otp } = req.body;
    let sent = verifyOTP(from_mobile_no, otp)
    if (!sent) {
        res.status(403)
        res.send("failed to verify")
        return
    }

    try {
        let reciept = await contract.methods.sendOwnership(from_mobile_no, to_mobile_no, serial_no).send()
        res.status(200)
        res.send(reciept)
    } catch (err) {
        res.status(400)
        res.send(err.message)
    }
})

async function getOwnerOf(serial_no) {
    let contract = await contractPromise;
    try {
        let owner = await contract.methods.getSerialNoOwnerMobileNo(serial_no).call()
        return owner;
    } catch (err) {
        return -1;
    }
}


router.get("/getNFT", async (req, res) => {
    let contract = await contractPromise;
    let { mobile_no, serial_no } = req.query;
    try {
        let NFT = await contract.methods.getNFTFor(mobile_no, serial_no).call()
        res.send(NFT)
    } catch (err) {
        res.status(403).send(err.message)
    }
})




router.get("/transferWarranty", (req, res) => {
    res.render("../views/transferNFT")
})

router.get("/getReceipt", async (req, res) => {
    let contract = await contractPromise;
    let { mobile_no, serial_no: serial_no_q } = req.query;
    try {
        let NFT = await contract.methods.getNFTFor(mobile_no, serial_no_q).call()
        let [startTime, endTimeInterval, serial_no, CID] = NFT
        startTime *= 1000
        endTimeInterval *= 1000
        let url = `https://ipfs.io/ipfs/${CID}`
        let curTime = Math.ceil(Math.random() * 100000)
        let { brand_name, model_no, warranty_period, remarks, } = JSON.parse((await readURL(url)).toString())

        let startDate = new Date(startTime).toLocaleDateString()
        let expiryDate = new Date(startTime + warranty_period * oneMonth).toLocaleDateString()
        let history = await getHistory(serial_no)
        let doc = await genPDF(brand_name, model_no, serial_no, warranty_period, expiryDate,
            curTime, remarks, history)

        let pdfBuf = []
        doc.on('data', chunk => pdfBuf.push(chunk))
            .on('end', () => {
                res.setHeader("Content-Type", "application/pdf")
                res.send(Buffer.concat(pdfBuf))
            })
    } catch (err) {
        console.error(); (err)
        res.status(502).send("<center><strong>&times; PDF generation Failed</strong></center>:<" + (err.message || err) + ">")
    }
})

router.get("/checkDetails", (req, res) => {
    res.render("../views/checkDetails")
})

router.get("/getMinterOf", async (req, res) => {
    let { serial_no } = req.query
    let doc = await minterModel.findOne({
        serial_no
    })
    if (doc === null) {
        res.status(403).send("Not Found")
        return
    }
    res.send(doc.minterName)
})

router.get("/getDetails", async (req, res) => {
    let { serial_no } = req.query
    let owner = await getOwnerOf(serial_no)
    if (owner == -1) {
        res.status(403).send("error")
        return
    }

    try {
        let doc = await minterModel.findOne({
            serial_no
        })
        if (doc === null) {
            res.status(403).send("Not Found")
            return
        }
        let minterName = doc.minterName
        res.json({ minterName, mobile_no: owner })
    } catch (err) {
        res.status(400).send("please provide correct data")
    }
})
module.exports = router