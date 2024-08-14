const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const config = require("./config/config");
const healthCheck = require("./routes/health-check/health-check.route");
const mongoDBConnection = require("./db/mongodb");
const userRoute = require("./routes/users/user.route");
const cookieParser = require("cookie-parser");

const PORT = config.PORT || 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("common"));
app.use(cookieParser());
app.use(express.static("public"));
app.use(
  cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);
mongoDBConnection();

app.use("/api/v1", healthCheck, userRoute);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
