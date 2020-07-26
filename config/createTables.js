var pool = require("./postgrePool");

createTables = async () => {
  try {
    const usersQ = `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(50) UNIQUE,
      fname VARCHAR(50),
      lname VARCHAR(50),
      password VARCHAR(255),
      promo_code VARCHAR(255)
      )`;
    const transactionsQ = `CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      product VARCHAR(255),
      model VARCHAR(255),
      date DATE,
      quantity int,
      price int,
      cvv int,
      exp_date VARCHAR(255),
      c_number VARCHAR(50),
      name VARCHAR(100),
      username VARCHAR(100)
      )`;
    const promocodeQ = `CREATE TABLE IF NOT EXISTS promocode (
        id SERIAL PRIMARY KEY,
        code VARCHAR(255),
        discount_percentage int
        )`;
    await pool.query(usersQ);
    await pool.query(transactionsQ);
    await pool.query(promocodeQ);
  } catch (error) {
    console.log(error);
  }
};
createTables();
