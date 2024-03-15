const express = require('express');
const promClient = require('prom-client');

const app = express();
const port = 8080;

const counter = new promClient.Counter({
  name: 'requests_total',
  help: 'Total number of requests',
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

app.get('/', (req, res) => {
  counter.inc();
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
