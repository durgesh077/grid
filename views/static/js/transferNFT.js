let form = document.getElementById("transferNFT")
let button;
async function sendOTP(el) {
    button = el;
    let fd = new FormData(form)
    let sp = new URLSearchParams()
    for (let [name, value] of fd.entries())
        sp.append(name, value)
    try {
        let ret = await fetch("/user/OTPForTransferNFT", {
            method: 'post',
            body: sp,
        })
        if (ret.status != 200) {
            alert("failed!!")
            return
        }

        el.innerHTML = "verify OTP"
        let inputBox = document.createElement('input')
        inputBox.type = 'number'
        inputBox.name = "otp"
        for (let inps of form.children)
            inps.disable = true
        form.append(inputBox)
        el.onclick = verifyOTPToTransfer
    } catch (err) {
        alert(err.message)
    }
}
async function verifyOTPToTransfer() {

    let fd = new FormData(form)
    let sp = new URLSearchParams()
    for (let [name, value] of fd.entries())
        sp.append(name, value)
    try {
        let ret = await fetch("/user/transferNFT", {
            method: 'post',
            body: sp
        })
        if (ret.status != 200) {
            let rs = await ret.text()
            console.log(rs)
            alert("failed is bad!!")
            return
        }
        alert("succeeded!!!!")
        location.reload()
    } catch (err) {
        alert(err.message)
    }
}