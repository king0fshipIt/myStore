var conString =
  "postgres://vfaanzuyxkhhqg:7feacfcaed99a2593d9227a50a37d537846b33eff76b0a254a06bd9fd5dca3da@ec2-34-202-88-122.compute-1.amazonaws.com:5432/d3fjq5tgpvgtfn";
// "postgres://agwnjlhpshmsfn:503d8e0b0005dd5334a62e5af4f0e302bff4f26afc89fbe650da8ec12b7c636b@ec2-3-91-139-25.compute-1.amazonaws.com:5432/dbcu0858dgc8ri";
const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString: conString,
  ssl: {
    rejectUnauthorized: false,
  },
});
module.exports = pool;

// const { Client } = require('pg');

// const client = new Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

// client.connect();

// client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row));
//   }
//   client.end();
// });
