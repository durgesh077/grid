const express = require("express")
const multer = require('multer')
const uploadSingleFile = require("./uploadSingleFile")
const bodyParser = require('body-parser')
const sessions = require('express-session')
const cookieParser = require('cookie-parser')
const { signup, login } = require('./signLog')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const oneDay = 1000 * 60 * 60 * 24;
const router = express.Router()

router.use(sessions({
	secret: "devTeamTrophy",
	saveUninitialized: true,
	cookie: { maxAge: oneDay },
	resave: false
}));
router.use(cookieParser());
router.get("/signup", (req, res) => {
	res.render("../views/signup")
})
router.get('/login', (req, res) => {
	let session = req.session

	if (session.userId) {
		res.render("../views/home", { userName: session.userName, userId: session.userId, ethAccountNo: session.ethAccountNo })
		return
	}
	else {
		res.render("../views/login")
	}
})
router.get("/upload", (req, res) => {
	res.render('../views/uploadWarranty')
})
router.post("/uploadMetadata", upload.single("image"), uploadSingleFile)
router.post("/signupForm", bodyParser.urlencoded({ extended: false }), signup)
router.post("/loginForm", bodyParser.urlencoded({ extended: false }), login)
module.exports = router