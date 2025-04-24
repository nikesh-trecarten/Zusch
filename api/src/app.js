const express = require("express");
const cors = require("cors");
require("dotenv").config();
const indexRoute = require("./routes/index.js");
const userRoute = require("./routes/user.js");
const boxesRoute = require("./routes/boxes.js");
const { clerkMiddleware } = require("@clerk/express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

app.use(clerkMiddleware());

app.use("/", indexRoute);
app.use("/user", userRoute);
app.use("/boxes", boxesRoute);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
