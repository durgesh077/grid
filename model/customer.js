const mongoose = require('mongoose')
const mongoDB_account = process.env.mongoDB_account
mongoose.connect(mongoDB_account)
const schema = mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    userName: { type: String, required: true },
    password: { type: String, required: true },
    ethAccountNo: { type: String, required: true }
})
const model = mongoose.model("customerDatas", schema)
module.exports = model;