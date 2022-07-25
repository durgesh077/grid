let messenger=document.getElementById("messenger")
function showMessage(msg, bg, fa) {
    messenger.style.backgroundColor = bg;
    messenger.innerHTML = `<i class='fas fa-${fa}'></i> ` + msg;
    messenger.style.opacity = 1;
    let timeToLeave = 5000
    setTimeout(() => messenger.style.opacity = (0), timeToLeave)
    setTimeout(() => messenger.innerHTML = "", timeToLeave + 2000)
}

async function submitForm(ev){
    try{

        ev.preventDefault();
        ev.stopPropagation();
        let inps=document.querySelectorAll("input")
        let usp=new URLSearchParams()
        usp.append("userId",inps[0].value)
        usp.append("password",inps[1].value)

        let ret=await fetch("/retailer/loginForm",{
            method:'post',
            body:usp
        })
        if(ret.status!=200)
            throw await ret.text()
        else{
           location.href="/"
        }
    }catch(err){
        showMessage(err.message||err,"red","times")
        return false;
    }
}

function afterConnection(){
    removeUser()
}
function startMetamask(){
let loaded=false;
let web3Script=document.createElement("script")
    web3Script.src="/js/web3.js"
    web3Script.onload=()=>{
        let metamask_connect_script=document.createElement("script")
        metamask_connect_script.src="/js/metamask_connect.js"
        document.body.append(metamask_connect_script)
    }

    document.body.append(web3Script)
}
let loaded=false;

async function removeUser(){
    try{
            accountNumber
            let userId=document.getElementById("userid").value
            if(userId==="")
                throw "userId should not be empty"
            let ret=await fetch("/retailer/api/getEthAccountNo?userId="+userId)
            if(ret.status!=200)
                throw await ret.text()
            else{
                let text=await ret.text()
                if(text!=accountNumber)
                    throw "Please use same metamask to delete your account "
                else{
                    let confirm=window.confirm("Do you want to Delete ?")
                    if(confirm==1){
                        res=await fetch("/retailer/api/deleteAccount?userId="+userId);
                        alert("successfully deleted your account.You can signup again.","green","check")
                    }else{
                        alert("canceled","orange","times")
                    }
                }
            }
        }catch(err){
            showMessage(err.message||err,"orange",'times')
        }
}

function forgotPassword(el){
    if(!loaded){
        startMetamask()
        loaded=true;
        showMessage("loading......","green","load")
    }else{
        removeUser()
    }
}