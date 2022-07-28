let form = document.getElementById("transferNFT")
let button=null;
async function sendOTP(el) {
    if(button===null)
        button = el;
    let fd = new FormData(form)
    fd.delete("otp")
    let sp = new URLSearchParams()
    for (let [name, value] of fd.entries())
        sp.append(name, value)
    
    try {
        button.disabled=true;
        button.style.cursor="not-allowed"
        let ret = await fetch("/user/OTPForTransferNFT", {
            method: 'post',
            body: sp,
        })
        //if(ret.status)
        button.disabled = false;
        button.style.cursor = "default"
        if (ret.status === 502) {
            showMessage(await ret.text(),'brown','times')
            return
        }else{
            showMessage(await ret.text(), "green", 'check',10000)
        }
        
        let otpLabel=document.getElementById("otpLabel")
        otpLabel.style.display='block'
        button.innerHTML = "verify OTP"
        button.onclick = verifyOTPToTransfer
    } catch (err) {
        showMessage(err.message,"red","times")
    }
}

async function verifyOTPToTransfer() {
    let fd = new FormData(form)
    let sp = new URLSearchParams()
    for (let [name, value] of fd.entries())
        sp.append(name, value)
    try {
        button.disabled = true;
        button.style.cursor = "not-allowed"
        let ret = await fetch("/user/transferNFT", {
            method: 'post',
            body: sp
        })
        button.disabled = false;
        button.style.cursor = "default"
        if (ret.status != 200) {
            let rs = await ret.text()
            showMessage(rs,"orange","times")
        }else
        showMessage("succeeded!!!!","green","check")
    } catch (err) {
        showMessage(err.message,'red','times')
    }
    for (let inps of document.querySelectorAll("#transferNFT input"))
        inps.value=""
    document.getElementById("otpLabel").style.display='none'
    button.innerHTML ="Get OTP"
    button.onclick=sendOTP
}
let messenger=document.getElementById("messenger")
function showMessage(msg, bg, fa, ttl = 5000) {
    messenger.style.backgroundColor = bg;
    messenger.innerHTML = `<i class='fas fa-${fa}'></i> ` + msg;
    messenger.style.opacity = 1;
    let timeToLeave = ttl
    setTimeout(() => messenger.style.opacity = (0), timeToLeave)
    setTimeout(() => messenger.innerHTML = "", timeToLeave + 2000)
}