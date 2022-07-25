const express = require("express")
const multer = require('multer')
const uploadSingleFile = require("./uploadSingleFile")
const bodyParser = require('body-parser')
const sessions = require('cookie-session')
const cookieParser = require('cookie-parser')
const apis = require("../apis/api")
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
router.use("/api", apis)
//router.get("/home",(req,res)=>{
//	res.render("../views/home", { userName: "durgeshm", userId: "dugesh077"	, ethAccountNo: 123142 })
//})
router.get("/upload", (req, res) => {
	if (!req.session.userId) {
		res.redirect("/retailer/login")
		return
	}
	res.render('../views/uploadWarranty')
})

router.post("/uploadMetadata", upload.single("image"), uploadSingleFile)
router.post("/signupForm", bodyParser.urlencoded({ extended: false }), signup)
router.post("/loginForm", bodyParser.urlencoded({ extended: false }), login)
router.get("/logout",(req,res)=>{
	req.session=null
	res.redirect("/retailer/")
})
router.get('/loginGuest',(req,res)=>{
	let guestId= "Guest" + Math.floor(Math.random() * 10000)
	res.render("../views/home", { userName: "Guest", userId: guestId })
})
router.get('/', (req, res) => {
	let session = req.session

	if (session.userId) {
		res.render("../views/home", { userName: session.userName, userId: session.userId })
		return
	}
	else {
		res.render("../views/login")
	}
})


router.get('/login',(req,res)=>{
	res.redirect('/retailer/')
})

router.get('/validate',(req,res)=>{
	res.render('../views/validate')
})
module.exports = router