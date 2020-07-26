var nodemailer = require("nodemailer");
var pool = require("../config/postgrePool");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/sendEmail");
var path = require("path");
const saltRounds = 10;

exports.signup = async (req, res) => {
  console.log("Body=", req.body);
  const email = req.body.email;
  const code = req.body.code;
  const user = await pool.query("SELECT * FROM users WHERE email=$1 ", [email]);
  const promo = await pool.query("SELECT * FROM promocode WHERE code=$1 ", [
    code,
  ]);
  // console.log(user.rows.length);
  if (user.rows.length) {
    return res.json({
      success: false,
      message: "Email already linked with another account",
    });
  } else if (!promo.rows.length && req.body.code) {
    return res.json({ success: false, message: "Promo Code Does not exist" });
  } else {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
    const payload = {
      ...req.body,
      code: promo.rows.length ? promo.rows[0].id : null,
    };
    console.log(payload);
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: parseInt(expirationDate.getTime() / 1000, 10),
    });
    const activationUrl = `${req.protocol}://${req.get(
      "host"
    )}/users/activate/${token}`;
    try {
      await sendEmail({
        email_address: req.body.email,
        subject: "Account Verification",
        message: `<p>Verify Your account by clicking <a href=${activationUrl}>here</a></p>`,
      });
      res.status(200).json({ success: true, data: "Email sent" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ err });
    }
  }
};
exports.activateUser = async (req, res) => {
  const token = req.params.token;
  try {
    var user = jwt.verify(token, process.env.JWT_SECRET);
    if (user) {
      const { fname, lname, email, code } = user;
      const salt = bcrypt.genSaltSync(saltRounds);
      const password = bcrypt.hashSync(user.password, salt);
      const userFound = await pool.query(
        "SELECT * FROM users WHERE email=$1 ",
        [email]
      );
      if (userFound.rows.length) {
        res.render("user-already-activated", { text: "please Login" });
      } else {
        createdUser = await pool.query(
          "INSERT INTO users (fName,lName,email,password,promo_code) VALUES ($1, $2, $3, $4, $5)",
          [fname, lname, email, password, code]
        );
        console.log(createdUser);
        // res.json(createdUser);
        res.render("login-form", { text: "please Login" });
      }
    }
    console.log(user);
  } catch (err) {
    console.log(err);
    res.render("Invalid-link", { text: "please Login" });
  }
};
exports.sendPassResetToken = async (req, res) => {
  const { email } = req.query;

  try {
    const user = await pool.query("SELECT * FROM users WHERE email=$1 ", [
      email,
    ]);
    console.log(user.rows);
    if (user.rows.length) {
      const today = new Date();
      const expirationDate = new Date(today);
      expirationDate.setDate(today.getDate() + 60);
      const token = jwt.sign({ ...user.rows[0] }, process.env.JWT_SECRET, {
        expiresIn: parseInt(expirationDate.getTime() / 1000, 10),
      });
      const resetUrl = `${req.protocol}://${req.get(
        "host"
      )}/users/reset_password/${token}`;
      await sendEmail({
        email_address: email,
        subject: "Password Reset Link",
        message: `<p>Reset you password by clicking <a href=${resetUrl}>here</a></p>`,
      });
      return res.json({
        success: true,
        message: "There is no account linked to this email",
      });
    } else {
      return res.json({
        success: false,
        message: "There is no account linked to this email",
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "Server Error" });
  }
};
exports.resetPass = (req, res) => {
  const token = req.params.token;
  try {
    var user = jwt.verify(token, process.env.JWT_SECRET);
    if (user) {
      res.sendFile(path.join(__dirname, "../public/updatepass.html"));
    }
  } catch (err) {
    console.log(err);
    res.render("Invalid-link", { text: "please Login" });
  }
};
exports.updatePassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    var user = jwt.verify(token, process.env.JWT_SECRET);

    if (user) {
      const salt = bcrypt.genSaltSync(saltRounds);
      const passwordHashed = bcrypt.hashSync(password, salt);
      const q = "UPDATE users SET password=$1 WHERE email=$2";
      const result = await pool.query(q, [passwordHashed, user.email]);
      await sendEmail({
        email_address: user.email,
        subject: "Password Updated Recently",
        message: `<p>Your account password was updated recently</p>`,
      });
      res.json({ success: true, result });
    }
  } catch (err) {
    console.log(err);
    res.render("Invalid-link", { text: "please Login" });
  }
};
exports.updatePass = async (req, res) => {
  const { token, password } = req.body;
  try {
    var user = jwt.verify(token, process.env.JWT_SECRET);

    if (user) {
      const salt = bcrypt.genSaltSync(saltRounds);
      const passwordHashed = bcrypt.hashSync(password, salt);
      const q = "UPDATE users SET password=$1 WHERE email=$2";
      const result = await pool.query(q, [passwordHashed, user.email]);
      await sendEmail({
        email_address: user.email,
        subject: "Password Updated Recently",
        message: `<p>Your account password was updated recently</p>`,
      });
      res.json({ success: true, result });
    }
  } catch (err) {
    console.log(err);
    res.render("Invalid-link", { text: "please Login" });
  }
};
exports.updateInfo = async (req, res) => {
  const { fname, lname, email } = req.body;
  try {
    const q = "UPDATE users SET fname=$1, lname=$2, email=$3 WHERE email=$3";
    const result = await pool.query(q, [fname, lname, email]);
    await sendEmail({
      email_address: req.user.email,
      subject: "Your Profile data Updated Recently",
      message: `<p>Your Profile data Updated Recently</p>`,
    });
    res.json({ success: true, result });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message:"server error" });
  }
};
exports.logout = (req, res) => {
  req.logout();
  res.redirect("/");
  // res.send({ success: true });
};
