const app = require("./src/app.js");
require("dotenv").config();
const router = require("./src/routers/router");
const PORT = process.env.PORT || 8000;

app.use("/", router);

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
