var express = require("express");
var router = express.Router();
var recordController = require("../controllers/recordController");


router.post("/add_transaction", recordController.insertData);
router.get("/get_data", recordController.getData);

module.exports = router;
