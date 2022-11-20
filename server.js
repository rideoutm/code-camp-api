const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bootcamps = require("./routes/bootcamps");
const connectDB = require("./config/db");
const app = express();
const PORT = process.env.PORT || 5000;
const errorHandler = require("./middleware/error");
dotenv.config({ path: "./config/config.env" });
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

//load env
connectDB();

app.use(express.json());
app.use(errorHandler);

// mount routers
app.use("/api/v1/bootcamps", bootcamps);

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error ${err.message}`);
  // close server & exit process
  server.close(() => process.exit(1));
});
