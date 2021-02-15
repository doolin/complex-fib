const keys = require('./keys');

// Express App setup
const express = require('express');
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


// Create React App Generation

// updated 8-4-2020

// In the next lecture, Stephen will be going over how to install 
// Create React App globally and generate the application. This method
// of generating a React project is no longer recommended.

// Instead of this:

// npm install -g create-react-app
// create-react-app client

// We need to run this command:

// npx create-react-app client

// Important Reminder:

// Once you have generated the React app you will need to delete the
// local git repository that Create React App may have automatically initialized.

// Inside the newly created client directory, run rm -r .git

// If you miss this step, the client folder will be considered a submodule
// and pushed as an empty folder to GitHub.

// Documentation:

// https://create-react-app.dev/docs/getting-started#npx

// If you've previously installed create-react-app globally via
// npm install -g create-react-app, we recommend you uninstall the package
// using npm uninstall -g create-react-app to ensure that npx always uses
// the latest version.




