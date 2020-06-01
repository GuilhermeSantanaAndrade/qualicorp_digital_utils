const dateValidations = require("./dateValidations");
const documentsValidations = require("./documentsValidations");
const emailValidations = require("./emailValidations");
const numberValidations = require("./numberValidations");
const passwordValidations = require("./passwordValidations");
const stringValidations = require("./stringValidations");

module.exports = {
  date: dateValidations,
  documments: documentsValidations,
  email: emailValidations,
  number: numberValidations,
  password: passwordValidations,
  string: stringValidations
}
