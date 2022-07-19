function addMoreRemark() {
    let remarkList = document.getElementById('remarks')
    let newList = document.createElement('li')
    let inputNew = document.createElement("textarea")
    inputNew.cols = 100
    newList.append(inputNew)
    remarkList.append(newList)
}
function removeLastRemark() {
    let remarkList = document.getElementById('remarks')
    remarkList.lastElementChild.remove()
}
async function uploadMetadata() {
    let form = document.getElementById('metadata')
    let fd = new FormData(form)
    let remarkData = []
    let remarkList = document.getElementById('remarks')
    for (let remarkNodeLi of remarkList.children) {
        let text = remarkNodeLi.firstElementChild.value
        remarkData.push(text)
    }
    fd.append('remarks', remarkData.join(','))
    let ret = await fetch("/retailer/uploadMetadata", {
        method: 'post',
        body: fd
    })
    console.log('done')
    if (ret.status == 200) {
        alert("successfull")
        console.log(await ret.text())
    } else {
        alert("something is wrong")
    }
}