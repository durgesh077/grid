const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
let OTPs = new Map()
async function sendOTP(mob_from, mob_to, serial_no) {
    let randOTP = Math.ceil(Math.random() * 100000)
    randOTP = (randOTP % (999999 - 100000)) + 100000
    let body = `Your OTP:${randOTP}
             Dear User! Seems you wan't to transfer your NFT for
             Serial-no: ${serial_no}
             to mobile no:${mob_to}
             If it were not you , just leave it`
    try {
        OTPs.set(mob_from, randOTP)
        setTimeout(() => {
            OTPs.delete(mob_from)
        }, 15 * 60000)
        await client.messages
            .create({
                from: '+19593012344',
                body,
                to: "+91"+mob_from
            })
        return true
    } catch (err) {
        console.log(err.message)
        return false;
    }
}

function verifyOTP(mob_from, otp) {
    if (!OTPs.has(mob_from))
        return false;
    if (OTPs.get(mob_from) == otp) {
        OTPs.delete(mob_from);
        return true;
    }

    return false;
}
module.exports = { sendOTP, verifyOTP }