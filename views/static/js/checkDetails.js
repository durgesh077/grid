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
    detailsInps[5].value = data.purchase_time

}

function afterConnection() {
    console.log("connected to ethereum")
}

async function search() {
    let serial_no = textBox.value
    if (serial_no === "") {
        details.style.display = 'none'
        return
    }
    try {
        showMessage("Searching....", "lightgreen")
        let ret = await fetch("/user/getDetails?serial_no=" + serial_no)

        if (ret.status != 200)
            throw await ret.text()
        else {
            let json = await ret.json()
            if (json.mobile_no == 0) {
                throw "not found"
            }
            let NFT = await fetch(`/user/getNFT?mobile_no=${json.mobile_no}&serial_no=${serial_no}`)
            if (NFT.status != 200) {
                throw "not loaded"
            }
            NFT = await NFT.json()
            let CID = NFT[3]

            ret = await Promise.any([fetch(`https://ipfs.io/ipfs/${CID}`), fetch(`https://gateway.pinata.cloud/ipfs/${CID}`)])
            if (ret.status != 200) {
                throw await ret.text()
            }
            ret = await ret.json()
            json = Object.assign(json, {
                purchase_date: new Date(NFT[0] * 1000).toLocaleDateString(),
                purchase_time: new Date(NFT[0] * 1000).toLocaleTimeString(),
                brand_name: ret.brand_name,
                model_no: ret.model_no
            })
            messenger.style.opacity = (0)
            messenger.innerHTML = ""
            showResult(json)
            let imgRet = await fetch(ret.image)
            let blob = await imgRet.blob()

            let url = URL.createObjectURL(blob)

            let img = document.querySelector("#details img")
            img.src = url

        }
    } catch (err) {

        showMessage(err.message || "please provide correct data", "red", "times")
    }
}