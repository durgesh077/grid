require("dotenv").config()
const express = require('express')
// const retailer = require('./retailer/retailer_server')
// const ecommerceAPI = require('./webServiceBlockchain/ecommerce_server')
// const useCases = require('./webServiceBlockchain/useCases')
// const webservice=require("./webServiceBlockchain/webservice")

const app = express()
// const path = require('path')
// app.set('view engine', 'ejs')
// app.use("/retailer", retailer)
// app.use( express.static(path.join(__dirname, "views", "static")))
// app.use("/ecommerce",ecommerceAPI)
// app.use("/user",useCases)
// app.use("/ecommercePages",webservice)
// app.get("/",(req,res)=>{
//     res.redirect("/retailer/")
// })
app.get("/",(req,res)=>{
    res.send("hello Guys");
})
app.listen(8000, () => console.log('ready!!!'))
