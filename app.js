require("dotenv").config();
const express = require("express");
const router = require("./api");
const app = express();
const cors = require("cors");
// Setup your Middleware and API Router here
const morgan = require("morgan");
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use("/api", router);

module.exports = app;
