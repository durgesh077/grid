const express = require("express")
const router = express.Router()

router.get("/pricing", (req, res) => {
    res.render("../views/pricing")
})

module.exports=router;