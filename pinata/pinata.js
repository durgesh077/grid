const pinataSDK=require("@pinata/sdk")
const pinata_api=process.env.Pinata_API_Key
const pinata_secret=process.env.Pinata_API_Secret
module.exports= pinataSDK(pinata_api, pinata_secret);