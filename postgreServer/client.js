const { Client } = require('pg');
const client = new Client({
  user: 'hrishabh',
  host: '127.0.0.1',
  database: 'mount_blue_psql',
  password: '1234',
  port: 5432,
});
client.connect();
module.exports = client;
