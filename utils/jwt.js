const jwt = require('jsonwebtoken')
const jwt_secret_key = process.env.JWT_SECRET
function getJWTToken(data, expiresInSec) {
    return jwt.sign(data, jwt_secret_key, {
        expiresIn: expiresInSec + 's'
    })
}

function extractData(token) {
    try {
        let json = jwt.verify(token, jwt_secret_key)
        return json
    } catch (err) {
        return false
    }
}
function authenticationMiddleware(req, res, next) {
    let token = req.headers['x-access-token']
    if (!token) {
        res.status(403).send("token needed")
        return
    }

    let info = extractData(token)
    if (info === false) {
        res.status(403).send("invalid token or expired ")
        return
    }

    delete info.iat
    delete info.exp
    for (let k in info)
        req.body[k] = info[k]
    next()
}
module.exports = { getJWTToken, extractData, authenticationMiddleware }