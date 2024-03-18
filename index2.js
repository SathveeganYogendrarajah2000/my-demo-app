const express = require("express");
const cors = require("cors");
const promClient = require("prom-client");

const app = express();
app.use(cors());
const port = 8081;

const counter = new promClient.Counter({
  name: "requests_total",
  help: "Total number of requests",
});

const incrementCounter = new promClient.Counter({
  name: "increment_requests_total",
  help: "Total number of /increment requests",
});

const gauge = new promClient.Gauge({
  name: "memory_usage",
  help: "Memory usage",
});

setInterval(() => {
  const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
  gauge.set(memoryUsage);
}, 1000);

const histogram = new promClient.Histogram({
  name: "request_duration",
  help: "Duration of HTTP requests in ms",
  buckets: [0.1, 5, 15, 50, 100, 500],
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

app.post("/increment", (req, res) => {
  incrementCounter.inc();
  counter.inc();
  console.log("Count incremented!");
  res.send("Count incremented!");
});

app.get("/", (req, res) => {
  const start = Date.now();
  res.send("Hello World!");
  const duration = Date.now() - start;
  histogram.observe(duration);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
