const mongoose = require("mongoose");
class MongoDB {
  constructor() {
    this._connect();
  }
  _connect() {
    const ENV = process.env.NODE_ENV || "dev";

    console.log("ENV ", ENV);
    let url = process.env.DATABASE_URL_DEV;

    if (ENV === "pro") {
      url = process.env.DATABASE_URL_PRO;
    }
    console.log("URI", url);
    mongoose
      .connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Database connection successful");
      })
      .catch((err) => {
        console.error("Database connection error");
      });
  }
}

module.exports = new MongoDB();
