module.exports = {
  getOnlyNumbers(str) {
    return str.replace(/[^\d]+/g, '')
  },
  hasFileExtension(fileName) {
    const re = /(?:\.([^.]+))?$/;
    const ext = re.exec(fileName)[1];

    return (!!ext);
  },
  getFileExtension(fileName) {
    const re = /(?:\.([^.]+))?$/;
    const ext = re.exec(fileName)[1];

    return (ext) ? ext : "";
  },
  normalize(value) {
    if (typeof value !== "string") {
      throw new Error("value is not a string")
    }

    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  },
  random(num) {
    const chars = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
    return [...Array(num)].map(i => chars[Math.random() * chars.length | 0]).join``;
  },
  removeMask(str) {
    if (typeof str !== "string") {
      throw new Error("value is not a string. (removeMask)");
    }
    
    return str.replace(/[^a-z0-9]/gi, '');
  },
}