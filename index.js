const pinataSDK=require("@pinata/sdk")
require("dotenv").config()
const pinata_api=process.env.Pinata_API_Key
const pinata_secret=process.env.Pinata_API_Secret
const pinata = pinataSDK(pinata_api, pinata_secret);
const {pinJson,pinImage}=require("./src/ipfs")(pinata)


