const express = require("express");
const dotenv = require("dotenv");
const bootcamps = require("./routes/bootcamps");

const app = express();
const PORT = process.env.PORT || 5000;

//load env
dotenv.config({ path: "./config/config.env" });

const logger = (req, res, next) => {
  req.hello("hello world");
  console.log("middleware ran");
  next();
};

app.use(logger);

// mount routers

app.use("/api/v1/bootcamps", bootcamps);

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
