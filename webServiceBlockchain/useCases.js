const express = require("express")
const bodyParser = require('body-parser')
const router = express.Router()
let contractPromise = require("../web3/contractConnect")
let { sendOTP, verifyOTP } = require('../utils/validateToTransfer')
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

router.get("/getOwnerOf", async (req, res) => {
    let contract = await contractPromise;
    let { serial_no } = req.query;
    try {
        let owner = await contract.methods.getSerialNoOwnerMobileNo(serial_no).call()
        res.send(owner)
    } catch (err) {
        res.status(404).send(err.message)
    }
})


router.get("/getNFT", async (req, res) => {
    let contract = await contractPromise;
    let { mobile_no, serial_no } = req.query;
    try {
        let owner = await contract.methods.getNFTFor(mobile_no, serial_no).call()
        res.send(owner)
    } catch (err) {
        res.status(404).send(err.message)
    }
})
module.exports = router