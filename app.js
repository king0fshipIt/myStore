var createError = require("http-errors");
var express = require("express");
var passport = require("passport");
const fs = require("fs");
require("dotenv").config();
var LocalStrategy = require("passport-local").Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;
var session = require("express-session");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var recordsRouter = require("./routes/records");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("./config/postgrePool");
require('./config/createTables');
var app = express();
// view engine setup
var cors = require("cors");
app.use(cors());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// app.get("/style.css", function (req, res) {
//   res.sendFile(__dirname + "/" + "style.css");
// });
/* GET users listing. */
app.use(
  session({
    secret: "secret-word",
    // cookie:{_expires : 60000000} ,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_APP_KEY,
      clientSecret: process.env.FB_APP_SECRET,
      callbackURL: "http://localhost:4000/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "emails","name"],
    },
     async (accessToken, refreshToken, profile, cb)=> {
       
      const q=`INSERT INTO users (fname, lname, email)
      SELECT * FROM (SELECT $1, $2, $3) AS tmp
      WHERE NOT EXISTS (
        SELECT email FROM users WHERE email = $3
        ) LIMIT 1`
        const {first_name, last_name, email} =profile._json
        await pool.query(q,[first_name,last_name,email])
        const user = await pool.query("SELECT * FROM users WHERE email=$1 ", [email]);
        console.log(user);
      return cb(null,user.rows[0])
    }
  )
);
app.get("/auth/facebook", passport.authenticate("facebook",{ scope : ['email'] }));

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    console.log("authenticated");
    res.redirect("/");
  }
);
passport.use(
  new LocalStrategy(function (username, password, next) {
    pool.query(
      "SELECT * FROM users WHERE email= $1",
      [username],
      (err, result) => {
        if (err) {
          console.log(err.code);
          next(null, false);
        } else {
          console.log("Login ", result.rows[0]);
          if (result.rows.length === 0) {
            next(null, false, { message: "Incorrect username." });
          } else {
            bcrypt
              .compare(password, result.rows[0].password)
              .then(function (results) {
                console.log("data", result.rows[0]);
                if (results) {
                  next(null, result.rows[0]);
                } else {
                  next(null, false, { message: "Incorrect password." });
                }
              });
          }
        }
      }
    );
  })
);
passport.serializeUser(function (user, next) {
  next(null, user.id);
});

passport.deserializeUser(function (id, next) {
  pool.query("SELECT * FROM users WHERE id = $1", [id], (err, result) => {
    if (err) console.log(err);
    else {
      if (result.rows.length === 0) console.log(result);
      else next(null, result.rows[0]);
    }
  });
});
app.get("/api/get_roducts", async (req, res) => {
  console.log("Running");
  try {
    let rawdata = fs.readFileSync("./json/file.json");
    console.log(rawdata);
    let data = JSON.parse(rawdata);
    res.json({ success: true, data });
  } catch (err) {
    console.log(err);
    res.json({ message: "No products found" });
  }
});
app.get("/verify", (req, res) => {
  jwt.verify(req.query.token, process.env.JWT_SECRET, function (err, decoded) {
    if (err)
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });

    res.status(200).send(decoded);
  });
});

// app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/records", recordsRouter);

app.use(express.static(path.join(__dirname, "public")));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// module.exports = passport;
module.exports = app;
