const express = require("express")
const router = express.Router()



router.get("/transferWarranty", (req, res) => {
    res.render("../views/transferNFT")
})


module.exports = router;