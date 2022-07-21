let mongoose = require('mongoose')
let mongoDB_account = process.env.mongoDB_account
mongoose.connect(mongoDB_account)
let schema = mongoose.Schema({
    minterName: { type: String, required: true ,unique:true}
})
let model = mongoose.model("minterCollections", schema)
module.exports = model