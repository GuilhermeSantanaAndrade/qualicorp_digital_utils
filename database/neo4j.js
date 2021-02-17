const QNeo4j = require("@qualitech/qneo4j");
const moment = require('moment');
moment.locale("pt-br");

const customExecute = async function (queryOpt, opts, dateFieldsName = [], flatSublevel = "", dateFormat = "YYYY-MM-DD HH:mm:ss", gmt = 'GMT-3') {
  let response = await this.execute(queryOpt, opts);
  response = trataResult(response, dateFieldsName, dateFormat, gmt)

  if (flatSublevel) {
    response = response.map(item => item[flatSublevel]);
  }

  return response;
}

const trataObject = function (object, dateFieldsName = [], dateFormat = "YYYY-MM-DD HH:mm:ss", gmt = 'GMT-3') {
  for (let prop in object) {
    let field = object[prop];

    if (Array.isArray(field)) {
      for (let x = 0; x <= field.length - 1; x++) {
        field[x] = trataObject(field[x], dateFieldsName, dateFormat, gmt)
      }
    } else if (typeof field === "object") {
      field = trataObject(field, dateFieldsName, dateFormat, gmt);
    } else {
      if (dateFieldsName.find(fieldName => fieldName.toUpperCase() === prop.toUpperCase())) {
        try {
          field = parseInt(field)
          if (isNaN(field)) {
            field = '';
          }
        } catch (error) { }

        if (typeof field === "number") {
          if (gmt === 'GMT') {
            object[prop] = moment.utc(field).format(dateFormat);
          } else {
            object[prop] = moment(field).format(dateFormat);
          }
        }
      }
    }
  }
  return object
}

const trataResult = function (value, dateFieldsName = [], dateFormat = "YYYY-MM-DD HH:mm:ss", gmt = 'GMT-3') {
  if (Array.isArray(value)) {
    return value.map(item => trataObject(item, dateFieldsName, dateFormat, gmt));
  } else if (typeof value === "object") {
    return trataObject(value, dateFieldsName, dateFormat, gmt);
  } else {
    return value;
  }
}

exports.getQNeo4jCustom = function (connection) {
  const neo4jCustom = new QNeo4j(connection);
  neo4jCustom.customExecute = customExecute;
  return neo4jCustom;
}
exports.trataResult = trataResult;
