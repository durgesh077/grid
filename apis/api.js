const warrantyModel=require("../model/warranty")
const customerModel=require("../model/customer")
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
//getting ether account No

router.get("/getEthAccountno",async(req,res)=>{
    let {userId}=req.query
    try{
        let doc=await customerModel.findOne({
            userId
        })
        if(doc===null)
            res.status(403).send("no User Id exists")
        else
            res.send(doc.ethAccountNo)
    }catch(err){
        res.status(500).send("internal error")
    }
})

router.get("/deleteAccount",async(req,res)=>{
    let {userId}=req.query
    customerModel.deleteOne({
        userId
    }).then(res.send("deleted")).catch(res.status(400).send("Not deleted"))
})
module.exports=router