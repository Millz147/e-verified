import Crypto from "crypto";
import CryptoJS from "crypto-js";
import userModel from "../models/user.js";
import nodemailer from "nodemailer";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

//Email Transport
let emailTransport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: "insert your mail @gmail.com",
    pass: "insert the password",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

//Main Class
class ctrl {
  //Registration Controller
  static signUp = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const validator = errors.errors.map((err) => err.msg);
        res.status(500).json({ error: validator });
        return;
      }

      const { fullname, username, email, password } = req.body;
      const vtoken = Crypto.randomBytes(64).toString("hex");

      const hashPassword = CryptoJS.AES.encrypt(password, process.env.HASHKEY);
      let newUser = new userModel({
        fullname,
        username,
        email,
        password: hashPassword,
        vtoken,
      });

      const mailDetails = {
        from: '"Verify your email" testdemobymillz@gmail.com',
        to: email,
        subject: "Verify your E-Mail",
        html: `<h2>${fullname} Thanks for Registering on our site </h2>
                <h4>Please Verify your email by clicking this link. <h4>
                <a href="http://${req.headers.host}/user/verify-email?token=${vtoken}">Click here</a>`,
      };

      emailTransport.sendMail(mailDetails, (err, success) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Verification Mail sent to your E-Mail");
      });
      newUser = newUser.save();
      res
        .status(200)
        .json(
          "User Successfully Registered, Please check your mail to verify your account"
        );
    } catch (error) {
      console.log(error);
    }
  };
  //Email Verification
  static emailverify = async (req, res) => {
    try {
      const token = req.query.token;
      if (!token) {
        console.log("Unrecognized, Empty Token!!!");
        return;
      }
      const userUpd = await userModel.findOneAndUpdate(
        { vtoken: token },
        { vtoken: null, everify: true }
      );
      if (!userUpd) {
        console.log("Token not Valid");
        return;
      }
      const successmail = {
        from: '"Verification Success" testdemobymillz@gmail.com',
        to: userUpd.email,
        subject: "Your Email is now Verified",
        html: `<h2>Your account has been verified, ${userUpd.fullname}</h2>
                <h4>You can now get access to thousands of our features. Thank you</h4>
                <a href="http://${req.headers.host}/login">Click to login</a>`,
      };

      emailTransport.sendMail(successmail, (err) => {
        if (err) {
          console.log("Success Mail not sent");
        }
      });

      res.redirect("/login");
    } catch (error) {
      console.log(error);
    }
  };
  //Login Controller
  static login = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const validator = errors.errors.map((err) => err.msg);
        res.status(500).json({ error: validator });
        return;
      }
      const validInfo = await userModel.findOne({
        email: req.body.email,
      });
      if (!validInfo) {
        res.status(500).json("Invalid Email Address");
        return;
      }

      let OriginalPassword = CryptoJS.AES.decrypt(
        validInfo.password,
        process.env.HASHKEY
      ).toString(CryptoJS.enc.Utf8);
      OriginalPassword !== req.body.password &&
        res.status(500).json("Invalid Password");

      const Token = jwt.sign(
        {
          email: validInfo.email,
          password: OriginalPassword,
          everify: validInfo.everify,
        },
        process.env.HASHKEY,
        { expiresIn: "30 days" }
      );
      res.cookie("userToken", Token, {
        httpOnly: true,
        secure: false,
        maxAge: 300000,
      });

      console.log("Login Successfully");

      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };
}

export default ctrl;
