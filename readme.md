# epayghMomo [![GitHub issues](https://img.shields.io/github/issues/BigBobLittle/epayMomo)](https://github.com/BigBobLittle/epayMomo/issues) [![GitHub forks](https://img.shields.io/github/forks/BigBobLittle/epayMomo)](https://github.com/BigBobLittle/epayMomo/network)[![GitHub stars](https://img.shields.io/github/stars/BigBobLittle/epayMomo)](https://github.com/BigBobLittle/epayMomo/stargazers)[![Twitter](https://img.shields.io/twitter/url/https/github.com/BigBobLittle/epayMomo?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2FBigBobLittle%2FepayMomo)
This is an unofficial nodejs wrapper for [epaygh](https://epaygh.com/) mobile money. This package will help you to `charge your customers mobile money wallet` on all networks.  
`NOTE`: This package will only take care of sending the mobile money prompt to your customers phone.

## Installation
```js
npm i -s @bigboblittle/epaymomo
```


## Setup 
Please head over to
[epaygh](https://epaygh.com/) website to create account for yourself, on your dashboard, click *`integrations`* to create your keys. You'll need it in order to use this package.

**Required Fields**   
```js 
    merchant_key: "YOUR-MERCHANT-KEY-HERE",      
    app_id: "APP_ID",    
    app_secret: "APP-SECRET"   
For security reasons, please load your keys from your .env file  
``` 


## Example using express js 
```js 
const app = require('express')();
const epayMomo = require('@bigboblittle/epaymomo'); 

app.post('/testEpay', async(req,res,next) => {
 try {
       //load your keys here... remember it's a good practice to save such keys in your .env
    let epayConfig = {
        merchant_key: "YOUR-MERCHANT-KEY-HERE",
        app_id: "APP_ID",
        app_secret: "APP-SECRET"
      };
    
    //pass in username, amount, phonenumber, email, and config 
    epayMomo("username", 1, "0543892565", "email", epayConfig).then((value) => {

    //wait for a response when the promise is resolved 
     console.log(value);
    })

 } catch (error) {
     console.log(error)
 }
})

app.listen(process.env.PORT || 3000);

``` 

## Errors 
i have customized the errors from this package starting with `BIGBOBLITTLE` followed by the error itself 
![alt text](https://github.com/BigBobLittle/epayMomo/blob/master/example/epaygh/error2.PNG)  

## Note 

The [epaygh](https://epaygh.com/) momo API  
1. requires you to re-generate your `Authorization Token` after every 3600(1hr). This package takes care
of that, by first creating the `Authorization Token` for you and saves its expiration time in a file called `yourtoken. it then checks if the Token is expired and re-generate a new one before sending your momo request to the epaygh API. 
You can check the generated token and expiration time in a file called  `yourtoken`  
 
```js 
 **the actual api required parameters of epaygh**
{
    amount: 1.0,
    customer_email: "customer@email.com",
    customer_name: "Customer Name",
    customer_telephone: "057XXXXXXX",
    mobile_wallet_network: "tigo",
    mobile_wallet_number: "057XXXXXXX",
    payment_method: "momo",
    reference: "000000"
  }
```


2. the API requires you to provide the above information as parameters to the momo API  
Not all the information here matches my use case when creating the package. so i've set 
the  
`` customer_telephone: "057XXXXXXX",` and `mobile_wallet_number: "057XXXXXXX",``   
to the `phonenumber` of the user you're charging. 

3. Also, i've used [shortid](https://www.npmjs.com/package/shortid) to auto generate the reference for you. 

4. I've also taken  care of the `` mobile_wallet_network: "tigo"``
For this reason, you have to always make sure the phonenumber you pass to this package is always a `10 digit string`. Without it, you will get an error. 


5. I realized my use case dont really need my customers email ::::   `` customer_email: "customer@email.com",`` 
however, i've provided that field, but without it, you can still charge your customers. 

6. Finally, you'll need your `reference` to get your `transaction status`. Its always part of the ``success response`` from the api
![alt text](./example/epaygh/paymentsuccessful.png)




