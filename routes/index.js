var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
  
//   if(req.user){
//     res.sendFile(path.join(__dirname, "../public/dashboard.html")); 
//   }
//   else{
//     res.sendFile(path.join(__dirname, "../public/login-form.html"));
//   }
// });
// router.get('/login', function(req, res) {
//   // res.json({ok:true})
//   if(req.user){
//     console.log("Yes");
//     return res.sendFile(path.join(__dirname, "../public/dashboard.html"));

//   }
//   else{
//     console.log("NO");
//     return res.sendFile(path.join(__dirname, "../public/login-form.html"));
//     }
// });
router.get('/signup', function(req, res, next) {
  if(req.user){
    res.sendFile(path.join(__dirname, "../public/dashboard.html")); 
  }
  else{
    res.sendFile(path.join(__dirname, "../public/signup-form.html"));
  }
});
router.get('/buy_cell', function(req, res, next) {
  if(req.user){
    res.sendFile(path.join(__dirname, "../public/dashboard.html")); 
  }
  else{
    res.sendFile(path.join(__dirname, "../public/login-form.html"));
  }
});
module.exports = router;
