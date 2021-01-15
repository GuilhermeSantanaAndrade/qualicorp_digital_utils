const AppError = require("../exceptions/AppError");

const responseStructs = require("../responseStructs")
const { responseError, getErrorMessage } = responseStructs;

exports.handleError = async (error, req, res, _) => {
  const msg = getErrorMessage(error);

  if ((typeof error == "object") && (error.constructor) && (error.constructor.name === "AuthError")) {
    responseError(res, msg, 401)
  } else
    if ((typeof error == "object") && (error.constructor) && (error.constructor.name === "AppError")) {
      responseError(res, msg, 400)
    }
    else if (typeof error == "object" && error.response && (error.response === 400 || error.response !== 500))
      responseError(res, msg, 400)
    else {
      console.log(msg);
      if (process.env.NODE_ENV)
        responseError(res, "Ocorreu um erro interno. Contate o suporte", 500)
      else
        responseError(res, msg, 500)
    }
}