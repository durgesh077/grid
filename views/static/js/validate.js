let messenger = document.getElementById("messenger")
let textBox = document.querySelector(".search input")
let detailsInps = document.querySelectorAll("#details input")
let details = document.querySelector("#details")
function showMessage(msg, bg, fa) {
    messenger.style.backgroundColor = bg;
    messenger.innerHTML = `<i class='fas fa-${fa}'></i> ` + msg;
    messenger.style.opacity = 1;
    let timeToLeave = 5000
    //setTimeout(() => messenger.style.opacity = (0), timeToLeave)
    //setTimeout(() => messenger.innerHTML = "", timeToLeave + 2000)
}

function showResult(data) {
    details.style.display = "block"
    detailsInps[0].value = data.mobile_no
    detailsInps[1].value = data.minterName
    detailsInps[2].value = data.brand_name
    detailsInps[3].value = data.model_no
    detailsInps[4].value = data.purchase_date
    detailsInps[5].value = data.account_no
    detailsInps[6].value = data.verification
    detailsInps[7].value = data.result
    detailsInps[8].value = data.status
}

function afterConnection() {
}

const getNFT = async (mobile_no, serial_no) => {

    let NFT = await contract.methods.getNFTFor(mobile_no, serial_no).call()
    return NFT
}

async function getOwnerOf(serial_no) {
    let owner = await contract.methods.getSerialNoOwnerMobileNo(serial_no).call()
    return owner;
}

const getMinterOf = async (serial_no) => {
    let ret = await fetch(`/user/getMinterOf?serial_no=${serial_no}`)
    if (ret.status != 200) {
        throw await ret.text()
    }
    return await ret.text()
}



async function getDetails(serial_no) {
    try {
        showMessage("Searching....", "lightgreen")
        let json = {}
        json.mobile_no = await getOwnerOf(serial_no)

        json.minterName = await getMinterOf(serial_no)


        if (json.mobile_no == 0) {
            throw "not found"
        }
        let NFT = await getNFT(json.mobile_no, serial_no)

        let CID = NFT[3]
        let ret = await fetch(`https://ipfs.io/ipfs/${CID}`)
        if (ret.status != 200) {
            throw await ret.text()
        }
        ret = await ret.json()
        let body = [
            ret.brand_name, ret.model_no, ret.warranty_period, ret.remarks.join(",")
        ].join("\/")
        let hash = web3.utils.keccak256(body)
        let hashContent = ret.hashContent
        let retailer_acc_no = await web3.eth.personal.ecRecover(hash, hashContent)
        let purchase_date = new Date(NFT[0])
        console.log(NFT[0])
        let expiryTimestamp = (purchase_date.setMonth(purchase_date.getMonth() + ret.warranty_period))
        let is_expired = (expiryTimestamp < new Date())
        json = Object.assign(json, {
            purchase_date: purchase_date.toLocaleDateString(),
            brand_name: ret.brand_name,
            model_no: ret.model_no,
            account_no: retailer_acc_no,
            verification: retailer_acc_no == accountNumber.toLowerCase() ? "successfull" : "failed",
            result: is_expired ? "expired" : "not expired",
            status: (!is_expired && (retailer_acc_no == accountNumber)) ? "valid" : "invalid"
        })
        messenger.style.opacity = (0)
        messenger.innerHTML = ""
        showResult(json)
        let imgRet = await fetch(ret.image)
        let blob = await imgRet.blob()

        let url = URL.createObjectURL(blob)

        let img = document.querySelector("#details img")
        img.src = url

    } catch (err) {

        showMessage(err.message || "please provide correct data", "red", "times")
    }
}

async function search() {
    let serial_no = textBox.value
    getDetails(serial_no)
}