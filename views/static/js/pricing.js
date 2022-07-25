let secretKey = document.getElementById("secretKey")
let helper = document.getElementById("helper")
let secret = document.getElementById('secret')
let messenger = document.getElementById("messenger")
let expiresInSec
let codes = helper.querySelectorAll("code")
codes[0].textContent =
    `curl -X POST ${location.protocol}//${location.host}/ecommerce/mintNFT -H "x-access-token:<secret_key>" -d "mobile_no=<mobile_no>&serial_no=<serial_no>&warranty_id=<warranty_id>&startAfter=<startAfter>"`

codes[1].textContent = `curl -X POST ${location.protocol}//${location.host}/ecommerce/burnNFT -H "x-access-token:<secret_key>" -d "serial_no=<serial_no>"`
async function getSecretKey(time) {
    expiresInSec = time
    secretKey.style.display = "block";
}

function copyText() {
    let text = secret.innerText
    navigator.clipboard.writeText(text)
    showMessage('copied','orange','copy')
}

function cutIt() {
    secretKey.style.display = "none";
    secret.innerText = ""
}

async function getSecret() {
    let inp = secretKey.querySelector("input").value
    let usp = new URLSearchParams()
    usp.append("minterName", inp)
    usp.append("expiresInSec", expiresInSec)
    try {
        let ret = await fetch("/ecommerce/register", {
            method: 'post',
            body: usp
        })
        if (ret.status == 200) {
            secret.innerText = await ret.text()
        } else {
            showMessage(await ret.text(), "orange", "times")
        }
    } catch (err) {
        showMessage(err.message, 'red', 'times')
    }
}


function showMessage(msg, bg, fa) {
    messenger.style.backgroundColor = bg;
    messenger.innerHTML = `<i class='fas fa-${fa}'></i> ` + msg;
    messenger.style.opacity = 1;
    let timeToLeave = 5000
    setTimeout(() => messenger.style.opacity = (0), timeToLeave)
    setTimeout(() => messenger.innerHTML = "", timeToLeave + 2000)
}