import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

//Controller
import ctrl from '../controllers/user.ctrl.js'

//Middleware
import user from '../middleware/user.js'

const router = express.Router()
router.use(cookieParser());
dotenv.config()


//Registration Route
router
.route('/register')
.get((req,res)=>{
    res.json('Registration Form')
})
.post(user.signUp, ctrl.signUp)

//Login Route
router
.route('/login')
.get((req,res)=>{
    res.json('Login Form')
})
.post(user.login,ctrl.login)

//Verify E-mail
router
.route('/user/verify-email')
.get(ctrl.emailverify)

//Dashboard Route
router
.route('/dashboard')
.get(user.auth, async(req,res)=>{

    console.log('Welcome')
})

router.route("/logout").get(user.logout);
export default router