const formEvent = document.getElementById('dataEntry').addEventListener('submit', submitForm)
const button = document.querySelector('button[type="submit"]');
button.disabled = true;

function afterConnection() {
    button.disabled = false;
    //real Code
}
function showMessage(msg, bg, fa) {
    messenger.style.backgroundColor = bg;
    messenger.innerHTML = `<i class='fas fa-${fa}'></i> ` + msg;
    messenger.style.opacity = 1;
    let timeToLeave = 5000
    setTimeout(() => messenger.style.opacity = (0), timeToLeave)
    setTimeout(() => messenger.innerHTML = "", timeToLeave+2000)
}
async function submitForm(e) {
    document.body.style.backgroundColor = "lightgray";
    e.preventDefault();
    let data = []
    let form = e.target
    let fd = new FormData(form)
    let fname = fd.get('userName')
    let lname = fd.get('lname')
    fd.delete('lname')
    fd.delete('c_password')
    fd.set('userName', fname + " " + lname)
    fd.append("ethAccountNo", accountNumber);
    let body = new URLSearchParams();
    for (let [key, value] of fd.entries()) {
        body.append(key, value)
    }
    let messenger = document.getElementById("messenger")
    try {
        let ret = await fetch("/retailer/signupForm", {
            method: 'post',
            body
        })
        let button = Object.assign(document.createElement("a"), {
            style: `padding:2px 5px;border:2px double white;display:block;text-decoration:none;
                    background-color:blue;color:white`,
            innerHTML: `LogIn`,
            href: "/retailer/login"
        })
        console.log(button.outerHTML)
        let bg = ret.status === 200 ? 'green' : 'tomato'
        let msg = ret.status === 200 ? "Successful" + button.outerHTML : await ret.text()
        let fa = ret.status === 200 ? "check" : 'times'
        showMessage(msg, bg, fa)
    } catch (err) {
        showMessage(err.message, 'red', "times")
    }

}

