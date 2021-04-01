const neo4j = require("./neo4j");
const mssql = require("./mssql");
const cacheProvider = require("./cache");

module.exports = {
  neo4j: neo4j,
  mssql: mssql,
  cache: cacheProvider
}
