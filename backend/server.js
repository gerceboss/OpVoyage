const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const routes = require("./routes/routes");

const app = express();

dotenv.config("");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", routes);

const port = process.env.PORT || 3000;
console.log(port);
app.listen(port, () => {
  console.log(`listening to the port ${port}`);
});
