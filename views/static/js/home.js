let brand_name_doc = document.getElementById("brand_search")
let model_no_doc = document.getElementById("model_search")
let collections=document.getElementById('collections').firstElementChild
function add(d){
    let doc=document.createElement("li")
    let html=`
        <p>Brand Name: ${d.brand_name}</p>
        <p>Model Number: ${d.model_no}</p>
        <p>CID: <span style="user-select:all">${d.CID}</span></p>
        <p>warrantyNo: <span style="user-select:all">${d._id} </span></p>
    `
    doc.innerHTML=html
    collections.append(doc)
}
async function hello() {
    collections.innerHTML=""
    if(brand_name_doc.value=="" && model_no_doc.value==""){
        return
    }
    let ret = await fetch(`/retailer/api/warrantyDetail?brand_name=${brand_name_doc.value}&model_no=${model_no_doc.value}`)

    let data = await ret.json()
    for(let d of data){
        add(d)
    }
}
let getWarrantyNo = debounce(hello, 500)
let warrantyEntry = document.getElementById("warrantyEntry")
function showHide(el){
    let disp=warrantyEntry.style.display
    if (disp == "none"){
        warrantyEntry.style.display="block"
        warrantyEntry.style.transform="scaleY(1)"
    }else{
        warrantyEntry.style.display = "none"
        warrantyEntry.style.transform = "scaleY(0)"
    }
}