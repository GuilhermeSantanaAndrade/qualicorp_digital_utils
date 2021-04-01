const responseSuccess = function (res, resData, status = 200) {
  const data = {
    status: status,
    message: "OK",
    data: resData
  };
  
  res.customData = data;
  res.customStatus = status;
  return res.status(status).json(data);
};

const responseError = function (res, err, status = 500) {
  const data = {
    status: status,
    message: err.message || err
  };
  
  res.customData = data;
  res.customStatus = status;
  res.status(status).json(data);
};

const getErrorMessage = function (error) {
  if (error) {
    if (error.code && error.code == "ECONNREFUSED") {
      return error.message + " (" + error.config.url + ")"
    }

    if (error.response && error.response.data && error.response.data.message)
      return error.response.data.message;

    if (error.message)
      return error.message;

    if (typeof error == "string")
      return error;
  }
  return "";
}

module.exports = {
  responseSuccess,
  responseError,
  getErrorMessage
}