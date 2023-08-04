require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();

mongoose
  .connect(process.env.DATABASE_CONNECTION_URL)
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((error) => {
    console.log(error);
  });

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use("/api", authRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app is running at port ${port}`);
});
