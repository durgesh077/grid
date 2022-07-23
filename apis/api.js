const warrantyModel=require("../model/warranty")
const express = require("express")
const router = express.Router()
router.get("/warrantyDetail", async (req, res) => {
    let userId = req.session.userId
    if(!userId){
        res.status(405).send("please login first")
        return
    }
    let { brand_name, model_no } = req.query
    try {
        let doc =await warrantyModel.find({userId,
            brand_name:{$regex:".*"+brand_name+".*",$options:"i"},
            model_no: { $regex: ".*" + model_no + ".*", $options: "i" }
        })

        res.send(Object.assign(doc,{warrantyNo:doc._id}))
	} catch (err) {
        res.status(400).send(err.message)
    }
})

module.exports=router