const express = require("express")
const bodyParser = require('body-parser')
const router = express.Router()
let contractPromise = require("../web3/contractConnect")
const minterModel = require("../model/minter")
const minterCollection = require("../model/minterCollection")
const warrantyModel = require("../model/warranty")
const { getJWTToken, authenticationMiddleware } = require('../utils/jwt')

router.use(bodyParser.urlencoded({ extended: false }))

router.post("/register", async (req, res) => {
    let { minterName, expiresInSec } = req.body;
    let doc = await minterCollection.findOne({ minterName })
    if (!!doc) {
        res.status(400).send("minter already exists")
        return
    }
    try{
    doc=await minterCollection.create({minterName})
    let hash = getJWTToken({
        minterName
    }, expiresInSec)
    res.send(hash)
    }catch(err){
        res.status(501).send(err.message)
    }
})

router.patch("/register", async (req, res) => {
    let { minterName, expiresInSec } = req.body;
    let doc = await minterCollection.findOne({ minterName })
    if (!doc) {
        res.status(405).send("minter does not exists")
        return
    }

    let hash = getJWTToken({
        minterName
    }, expiresInSec)
    res.send(hash)
})

router.post("/mintNFT", authenticationMiddleware, async (req, res) => {
    let contract = await contractPromise;
    let { minterName, mobile_no, serial_no, warranty_id, startAfter } = req.body
    try {

        await minterModel.create({
            minterName,
            serial_no
        })
        let doc=await warrantyModel.findById(warranty_id)
        let CID=doc.CID
        let receipt = await contract.methods.mintWarrantyCardNFT(mobile_no, serial_no, CID, startAfter).send();
        res.status(200)
        res.send(receipt)
    } catch (err) {
        res.status(404)
        res.send(err.message)
    }
})

router.post("/burnNFT", authenticationMiddleware, async (req, res) => {
    let contract = await contractPromise;
    let { minterName, serial_no } = req.body

    try {
        let doc = await minterModel.findOne({ minterName, serial_no })
        if (doc == null) {
            res.status(405).send("You are not allowed")
            return
        }
        let receipt = await contract.methods.burnWarrantyCardNFT(serial_no).send();
        res.status(200)
        res.send(receipt)
    } catch (err) {
        res.status(404)
        res.send(err.message)
    }
})
module.exports = router
