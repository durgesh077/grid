let mongoose = require('mongoose')
let mongoDB_account = process.env.mongoDB_account
mongoose.connect(mongoDB_account).catch(err=>console.log(err.message))
let schema = mongoose.Schema({
	CID: { type: String, required: true },
	brand_name: { type: String, required: true },
	model_no: { type: String, required: true },
	userId: { type: String, required: true }
})
let model = mongoose.model("warrantyCollection", schema)
module.exports = model