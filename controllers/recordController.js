var pool = require("../config/postgrePool");
var sendEmail = require("../utils/sendEmail");
exports.insertData = async (req, res) => {
  const {
    product,
    model,
    quantity,
    card_number,
    name,
    expiry,
    cvv,
    price,
  } = req.body;
  console.log("body",req.body);

  try {
    result = await pool.query(
      "INSERT INTO transactions (product, model, quantity, date, username, price, name, c_number,exp_date,cvv) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
      [
        product,
        model,
        quantity,
        new Date(),
        req.user.email,
        price,
        name,
        card_number,
        expiry,
        cvv,
      ]
    );
    await sendEmail({
      email_address: req.user.email,
      subject: "Receipt of Purchase",
      message: `<h1>Thanks for purchasing</h1>
      <p1>You have successfully purchased the following products</p1>
      <p1>${product} x ${quantity}</p1>
      <p1>Price:${price}$ x ${quantity} = ${price * quantity}$ </p1>
      `,
    });
    res.json({ success: true });
    // console.log(result);
  } catch (err) {
    console.log(err);
  }
};

exports.getData = async (req, res) => {
  try {
    q = "SELECT * FROM transactions WHERE username=$1";
    data = await pool.query(q, [req.user.email]);
    return res.json({ success: true, data:data.rows });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "Server Error" });
  }
};

exports.updateData = (req, res) => {
  console.log(req.query);
  const q =
    "UPDATE data SET user_name=$1, data1=$2, data2=$3, lat=$4, long=$5 WHERE _id=$6";
  pool.query(
    q,
    [
      req.query.user_name,
      req.query.data1,
      req.query.data2,
      req.query.lat,
      req.query.long,
      req.query._id,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        res.json({ success: true });
      }
    }
  );
};
