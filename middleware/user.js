import { check } from "express-validator";
import jwt from "jsonwebtoken";


//Main Class
class user {
  //Input Validations
  static signUp = [
    check("email")
      .isEmail()
      .withMessage("A valid Email is required")
      .notEmpty()
      .withMessage("Email Field is required"),
    check("username").notEmpty().withMessage("Username is required"),
    check("fullname").notEmpty().withMessage("Fullname is required"),
    check("password").notEmpty().withMessage("Password is required"),
  ];
  static login = [
    check("email")
      .isEmail()
      .withMessage("Invalid Email Address!!!")
      .notEmpty()
      .withMessage("Email Cannot be Empty"),
    check("password").notEmpty().withMessage("Password Cannot Be Empty"),
  ];
  //User Authentication
  static auth = async (req, res, next) => {
    let inputToken = await req.cookies.userToken;

    try {
      if (inputToken != null) {
        await jwt.verify(inputToken, process.env.HASHKEY, (err, User) => {
          if (err) {
            res.json("Invalid Token");
            return;
          }
          req.user = User;

          if (req.user.everify === false) {
            console.log("Please Check your Email for verification");
            return;
          }
          return next();
        });
      } else {
        return res.status(500).json("Please go back and Login");
      }
    } catch (error) {
      console.log(error);
    }
  };
  //Logout
  static logout = async (req, res) => {
    try {
      return res.clearCookie("userToken").json("Successfully Logout");
    } catch (error) {
      console.log("error: " + error.code);
    }
  };
}

export default user;
