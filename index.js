const setupEnvironment = require("./config");
const responseStructs = require("./responseStructs");
const AppError = require("./Exceptions/AppError");
const AuthError = require("./Exceptions/AuthError");
const middlewares = require("./middlewares");
const validations = require("./validations");
const conversions = require("./conversions");
const database = require("./database");

module.exports = {
  setupEnvironment: setupEnvironment,
  responseStructs: responseStructs,
  AppError: AppError,
  AuthError: AuthError,
  middlewares: middlewares,
  validations: validations,
  conversions: conversions,
  database: database,
}