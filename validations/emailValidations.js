module.exports = {
  isValid(value) {
    return value.indexOf('@') > -1
      && value.split('@')[1].indexOf('.') > -1;
  },

  isValid_v2(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
}