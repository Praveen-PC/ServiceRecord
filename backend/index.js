const express = require("express");
const bodyparser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const db = require("./model/db");
const routes = require("./routes/recordRouter");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:5173",
    method: ["GET", "DELETE", "PUT", "POST"],
  })
);

app.get("/", (req, res) => {
  res.send("hello from backend");
});

app.use("/api", routes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, (err) => {
  console.log(`server running on ${PORT}`);
});
