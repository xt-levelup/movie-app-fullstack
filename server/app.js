// ---------------------------------------------------------------//
// -----------THIẾT LẬP SERVER NODEJS VỚI PORT 5000---------------//
// --------------------------------------------------------------//

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const movieRouter = require("./routes/movies");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(movieRouter);

app.listen(5000);
