function dragOver(ev) {
    ev.preventDefault()
    ev.stopPropagation()
    ev.target.classList.add("dragOver")
}
function dropped(ev) {
    ev.preventDefault()
    ev.stopPropagation()
    ev.target.classList.remove("dragOver")
    let file = ev.dataTransfer.files[0]
    try {
        ev.target.lastElementChild.file = file;
        console.log(ev.target.lastElementChild)
        ev.target.firstElementChild.innerHTML = file.name
    } catch {
        showMessage("not uploaded","orange","times")
    }
}
function dragLeave(ev) {
    ev.target.classList.remove("dragOver")
}
function uploadImg(ev) {
    ev.preventDefault()
    let imgInp=Object.assign(document.createElement("input"),{
        type:'file',
        accept:"images/*",
        style:'display:none;',
        class:"textbox"
        })
    imgInp.click()
}

function activate(n) {
    let tabSelector = document.querySelector(".module> ul")
    let childs = tabSelector.children
    childs[1 - n].classList.remove('activeSelector')
    childs[n].classList.add('activeSelector')

    let tabs = document.querySelectorAll(".module > div")
    tabs[1 - n].classList.remove('activeTab')
    tabs[n].classList.add('activeTab')
}

function addMoreRemark() {
    let remarkNo = document.querySelectorAll("#remarkForm>input").length + 1
    let input = Object.assign(document.createElement("input"), {
        type: "text",
        placeholder: "Remark-" + remarkNo,
        name: "Remark_" + remarkNo
    })
    input.classList.add("textbox")
    let addMoreButton = document.querySelector(".buttonGroup")

    document.querySelector("#remarkForm").insertBefore(input, addMoreButton)
}

function removeRemark() {
    let remarks = document.querySelectorAll("#remarkForm>input[type='text']")
    try {
        remarks[remarks.length - 1].remove()
    } catch (err) {
        showMessage(err.message,"orange","times")
    }
}


async function submitForm() {
    messenger.innerHTML = ""
    messenger.style.opacity = (0)
    let fd = new FormData(document.getElementById("gadgetForm"))
    let fdRemarks = new FormData(document.getElementById("remarkForm"))
    let remarks = []
    for (let [k, v] of fdRemarks.entries()) {
        remarks.push(v)
    }
    let remarkString = remarks.join(",")
    fd.append("remarks", remarkString)

    let imageDoc = document.getElementsByName('image')[0]
    fd.set("image", imageDoc.file)
    let body = [fd.get("brand_name"),fd.get("model_no"),fd.get("warranty_period"),
                fd.get("remarks")].join('\/')

    try {
        showMessage("uploading...","maroon","upload",-1);
        let hash = web3.utils.keccak256(body)
        let hashContent = await web3.eth.personal.sign(hash, accountNumber)
        fd.append("hashContent", hashContent)
        let ret = await fetch("/retailer/uploadMetadata", {
            method: 'post',
            body: fd
        })

        if (ret.status == 200) {
            showMessage("warranty_id: "+await ret.text(), 'green', 'check', -1)
        } else {
            showMessage(await ret.text(), 'red', 'times', -1)
        }
    } catch (err) {
        showMessage(err.message, 'red', 'times')
    }
}

function afterConnection() {
    let sendButton = document.getElementsByClassName('disabled')[0]
    sendButton.classList.remove("disabled")
    sendButton.disabled = false;
}

function showMessage(msg, bg, fa, TTL = 5000) {
    messenger.style.backgroundColor = bg;
    messenger.innerHTML = `<i class='fas fa-${fa}'></i> ` + msg;
    messenger.style.opacity = 1;
    if (TTL >= 0) {
        let timeToLeave = TTL
        setTimeout(() => messenger.style.opacity = (0), timeToLeave)
        setTimeout(() => messenger.innerHTML = "", timeToLeave + 2000)
    }
}