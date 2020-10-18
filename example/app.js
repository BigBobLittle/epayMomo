const app = require("express")();
const epayMomo = require("../index"); //replace package name here

app.post("/testEpayMomo", async (req, res, next) => {
  try {
    //load your keys here... remember it's a good practice to save such keys in your .env
    const epayConfig = {
      merchant_key: "YOUR-MERCHANT-KEY-HERE",
      app_id: "APP_ID",
      app_secret: "APP-SECRET",
    };

    //pass in the required info the the customer you're chargin
    epayMomo("username", 1, "0543892565", epayConfig).then((value) => {
      //wait for a response when the promise is resolved
      console.log(value);
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(process.env.PORT || 3000);
