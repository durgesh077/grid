let mongoose = require('mongoose')
let mongoDB_account = process.env.mongoDB_account
mongoose.connect(mongoDB_account)
let schema = mongoose.Schema({
    minterName: { type: String, required: true },
    serial_no:{type:String,required:true}
})
let model = mongoose.model("minters", schema)
module.exports = model