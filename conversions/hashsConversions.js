const cryptoJs = require('crypto-js');

const base64 = {
  async encode(value) {
    if (typeof value === "object")
      value = JSON.stringify(value);

    const buff = new Buffer(value);
    return buff.toString("base64");
  },

  async decode(base64value) {
    const buff = new Buffer(base64value, "base64");
    return buff.toString("ascii");
  }
};

const sha = {
  encode(value) {
    var sha256Hash = cryptoJs.SHA256(value);
    const sha = sha256Hash.toString();
    return sha;
  }
}

module.exports = {
  base64,
  sha
}