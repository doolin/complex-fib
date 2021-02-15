const keys = require('./keys');

// Express App setup
const express = require('./express');
const bodyParser = require('body-parser');
const cors  = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres client setup
const { Pool } = require('pg');
const pgClient = Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  passwrod: keys.pgPassword,
  port: keys.pgPort
});

// Important Update for Table Query
// In the upcoming lecture, we will be adding some code to our server's
// index.js to make a query and create a table. Due to a change in the
// new major version of the Postgres image, we need to modify this code
// to ensure that we delay the table query until after a connection is made.

// In your server/index.js file:
// Change these lines:

//     pgClient.on('error', () => console.log('Lost PG connection'));
//     pgClient
//       .query('CREATE TABLE IF NOT EXISTS values (number INT)')
//       .catch(err => console.log(err));
     
// to this:
//     pgClient.on('connect', () => {
//       pgClient
//         .query('CREATE TABLE IF NOT EXISTS values (number INT)')
//         .catch((err) => console.log(err));
//     });
     
pgClient.on('connect', () => {
  pgClient
    .query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch((err) => console.log(err));
});
     

