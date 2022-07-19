const md5 = require("md5")
const customerModel = require("../model/customer")
async function saveLoginData(doc) {
    try {
        let ResDoc = new customerModel(doc)
        await ResDoc.save()
        return ResDoc
    } catch (err) {
        if (err.message.startsWith("E11000 duplicate key error"))
            return 1
        console.log(err.message || err)
        return -1;
    }
}

async function signup(req, res) {
    let body = req.body
    let doc = {
        userId: body.userId,
        userName: body.userName,
        password: md5(body.password),
        ethAccountNo: body.ethAccountNo
    }
    try {
        let ret = await saveLoginData(doc)
        if (ret == 1) {
            res.status(403)
            res.send("userId exists")
        } else
            if (ret == -1) {
                res.status(404)
                res.send("something went wrong!")
            } else {
                let session = req.session
                session.userId = doc.userId,
                    session.userName = doc.userName,
                    session.ethAccountNo = doc.ethAccountNo
                res.status(200)
                res.send("signed up successfull")
            }
    } catch (err) {
        res.status(501)
        console.log(err.message || err)
        res.send("Internal server error!")
    }
}

async function login(req, res) {
    let userId = req.body.userId
    let password = md5(req.body.password)
    let session = req.session
    try {
        let ret = await customerModel.findOne({ userId, password })
        if (ret == null) {
            res.status(404)
            res.send("Either username of password is wrong!")
        } else {
            session.userName = ret.userName
            session.userId = ret.userId
            session.ethAccountNo = ret.ethAccountNo
            res.status(200)
            res.render("../views/home", { userName: ret.userName, userId: ret.userId, ethAccountNo: ret.ethAccountNo })
        }
    } catch (err) {
        console.log(err.message || err)
        res.status(404)
        res.send("login unsuccessfull!")
    }
}
module.exports = { signup, login }