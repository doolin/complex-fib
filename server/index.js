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

// Redis client setup
const redis = require('redis');
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const redisPublisher = redis.RedisClient.duplicate();

// Express route handlers
app.get('/', (req, res) => {
  res.sent('Hi');
});

app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * FROM VALUES');

  res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
}); 

app.post('/values', async (req, res) => {
  const index  = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send('Index to high');
  }

  redisClient.hset('values', index, 'nothing yet');
  redisPublisher.publish('insert', index);
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

  res.send({ working: true });
});

app.listen(5000, err => {
  console.log('listening');
});

