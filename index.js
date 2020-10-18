
const rp = require("request-promise"),
  chalk = require("chalk"),
  moment = require("moment"),
  TokenStorage = require("./helpers/tokenStorage"),
   shortid = require("shortid");

const epayghBaseUrl = `https://epaygh.com/api/v1`;
const tokenStorage = new TokenStorage();
var AuthorizationToken = tokenStorage.get("access_token");

/**
 * @name generateAuthourizationToken
 * @param {*} config
 * @description function to generate epay authorization token
 */
async function generateAuthourizationToken(config) {
  try {
    //check if config is provided
    if (!config) {
      throw new Error(
        chalk.red(
          "EPAYGH-ERROR ---Please provide your API-Key, APP-ID, and APP-SECRET as config"
        )
      );
    }

    //check if type of config is an object
    if (typeof config !== "object") {
      throw new Error(
        chalk.red(
          `EPAYGH-ERROR --- Your config must be an object containing your  API-Key, APP-ID, and APP-SECRET`
        )
      );
    }

    //check if the api key, app id and app secret is provided in the config object
    if (!config.merchant_key || typeof config.merchant_key === "undefined") {
      throw new Error(
        chalk.red(`EPAYGH-ERROR --- Please provide your 'merchant_key', head over to your 
        dashboard, NEW INTEGRATIONS and generate your keys `)
      );
    }

    if (!config.app_id || typeof config.app_id === "undefined") {
      throw new Error(
        chalk.red(`EPAYGH-ERROR --- Please provide your 'app_id', head over to your 
        dashboard, NEW INTEGRATIONS and generate your keys `)
      );
    }

    if (!config.app_secret || typeof config.app_secret === "undefined") {
      throw new Error(
        chalk.red(`EPAYGH-ERROR --- Please provide your 'app_secret', head over to your 
        dashboard, NEW INTEGRATIONS and generate your keys `)
      );
    }

    //lets hit the generate token route with our keys to generate the auth token
    let options = {
      method: "POST",
      uri: `${epayghBaseUrl}/token`,
      json: true,
      body: config,
      headers: {
        "Content-type": "application/json"
      }
    };

    let letsGenerateKey = await rp(options);

    return letsGenerateKey.success
      ? tokenStorage.store(letsGenerateKey.data)
      : console.log(chalk.red(`BIGBOBLITTLE ${letsGenerateKey}`));
  } catch (error) {
    console.log(
      chalk.yellow(
        `please check the meaning to all errrors here:::\n https://docs.epaygh.com/docs/api-reference/ \n\n`
      ),
      chalk.red("BIGBOBLITTLE ---" + error)
    );
  }
}

/**
 * @name whichMomoNetwork
 * @description switch case to handle the network(telco) for momo options
 */
whichMomoNetwork = phonenumber => {
  let network = phonenumber.slice(0, 3);

  switch (network) {
    //?mtn
    case "054":
    case "024":
    case "055":
      case "059":
      return (network = "mtn");

    //?vodafon
    case "050":
    case "020":
      return (network = "vodafone");

    //?airtel
    case "056":
    case "026":
      return (network = "airtel");

    //?tigo
    case "057":
    case "027":
      return (network = "tigo");

    default:
      return (network = "mtn");
  }
};

/**
 * @name sendMomoPrompt
 * @param {*} username
 * @param {*} amount
 * @param {*} phonenumber
 * @param {*} email
 * @param {*} config
 * @description Handles sending momo prompt to your users phone
 */

async function sendMomoPrompt(username, amount, email, phonenumber, config) {
  try {
    //check for config
    if (!config || typeof config !== "object") {
      throw new Error(
        chalk.red(
          "EPAYGH-ERROR ---Please provide your api_id ,app_secret, and  merchant_key as an object"
        )
      );
    }

    //check for authorization token, generate new one when !exists
    if (!AuthorizationToken || AuthorizationToken == null) {
      await generateAuthourizationToken(config);
      AuthorizationToken = await tokenStorage.get("access_token");
    }

    //if authorization is available, check if it's not expired, if expired:: create new one
    if (AuthorizationToken) {
      const expires_at =  tokenStorage.get("expires_at");
      const whenExpires = moment(expires_at);
      const checkDate = moment().isSameOrBefore(whenExpires);

      if (!checkDate) {
        await generateAuthourizationToken(config);
        AuthorizationToken =  tokenStorage.get("access_token");
      }
    }

    //check username
    if (!username || typeof username !== "string") {
      throw new Error(
        chalk.red(
          "EPAYGH-ERROR ---Please provide the name of the customer you are charging"
        )
      );
    }

    //check amount
    if (!amount) {
      throw new Error(
        chalk.red(
          "EPAYGH-ERROR ---Please provide the amount you are charging your customer"
        )
      );
    }

    if (typeof amount !== "number") {
      throw new Error(
        chalk.red(
          "EPAYGH-ERROR ---The amount to charge your customer must be a number"
        )
      );
    }

    //phonenumber
    if (!phonenumber || typeof phonenumber !== "string") {
      throw new Error(
        chalk.red(
          "EPAYGH-ERROR ---Please provide the phonenumber of the customer you're charging as a string"
        )
      );
    }

    if (phonenumber.length !== 10) {
      throw new Error(
        chalk.red(
          "EPAYGH-ERROR ---Customer phonenumber must be exactly 10 digits string"
        )
      );
    }

    //get the momo network
    const momoNetwork = whichMomoNetwork(phonenumber);

    const momoParams = {
      reference:  shortid.generate(),
      amount: parseFloat(amount),
      payment_method: "momo",
      customer_name: username,
      customer_email: email || "very@unrelevant.com", //i think this is very unrelevant since not all users will even have an email account
      customer_telephone: phonenumber,
      mobile_wallet_number: phonenumber,
      mobile_wallet_network: momoNetwork,
      payment_description: "Charging my customers"
    };

    //lets hit the create route with our data to  send momo prompt to the users' phone

    const options = {
      method: "POST",
      uri: `${epayghBaseUrl}/charge`,
      json: true,
      body: momoParams,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${AuthorizationToken}`
      }
    };

    //console.log(options);
    return rp(options);
  } catch (error) {
    console.log(chalk.red("BIGBOBLITTLE ---" + error));
  }
}

module.exports = sendMomoPrompt;
