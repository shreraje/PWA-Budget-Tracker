// require("dotenv").config();

//Import packages
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

//PORT Setup
const PORT = process.env.PORT || 3000;

const app = express();

//Middlewares setup
app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

//Connecting to mongodb atlas & server
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/budget",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
);

// Import api routes
app.use(require("./routes/api.js"));

//Server setup after connecting to db
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});