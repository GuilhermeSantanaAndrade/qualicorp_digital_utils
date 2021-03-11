const moment = require("moment");
const AppError = require("../exceptions/AppError");

module.exports = {
  formatBrasil(date) {
    return moment(date).format("DD/MM/YYYY");
  },
  formatEUA(value) {
    if (!((typeof value === "string") || (typeof value === "number") || (typeof value.getMonth === "function"))) {
      throw new AppError("Formato de Data inválido.")
    }

    return moment(value).format("YYYY-MM-DD");
  },
  formatEUAdateTime(value) {
    if (!((typeof value === "string") || (typeof value === "number") || (typeof value.getMonth === "function"))) {
      throw new AppError("Formato de Data inválido.")
    }

    return moment(value).format("YYYY-MM-DD HH:mm:ss");
  },
  formatTimestamp(value) {
    if (!((typeof value === "string") || (typeof value === "number") || (typeof value.getMonth === "function"))) {
      throw new AppError("Formato de Data inválido.")
    }

    return moment(value).toDate().getTime();
  },
  getDiffBetweenDates(initialDate, finalDate) {
    if (!((typeof initialDate === "string") || (typeof initialDate === "number") || (typeof initialDate.getMonth === "function"))) {
      throw new AppError("Formato de Data inválido.")
    }

    if (!((typeof finalDate === "string") || (typeof finalDate === "number") || (typeof finalDate.getMonth === "function"))) {
      throw new AppError("Formato de Data inválido.")
    }

    initialDate = moment(initialDate).toDate();
    finalDate = moment(finalDate).toDate();

    let delta = Math.abs(finalDate - initialDate) / 1000;

    let days = Math.floor(delta / 86400);
    delta -= days * 86400;

    let hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    let minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    let seconds = delta % 60;

    return {
      days,
      hours,
      minutes,
      seconds
    }
  },
  getAge(birthDate, referenceDate = null) {
    if (!birthDate) {
      birthDate = moment().format("YYYY-MM-DD");
    }

    const hasTime = function (date) {
      return /\d{2,4}.\d{2}.\d{2,4}\s?\d{1,2}.\d{1,2}.\d{1,2}/g.test(date);
    };

    if (!hasTime(birthDate)) {
      birthDate += " 00:00:00";
    }

    if (referenceDate && !hasTime(referenceDate)) {
      referenceDate += " 00:00:00";
    }

    const refDate = referenceDate !== null ? new Date(referenceDate) : new Date();
    const birth = new Date(birthDate);
    let age = refDate.getFullYear() - birth.getFullYear();
    const diffMonths = refDate.getMonth() - birth.getMonth();

    if ((diffMonths < 0) || (diffMonths === 0 && (refDate.getDate() < birth.getDate()))) {
      age--;
    }
    return age;
  },
  clear(data, separator = "/") {
    return data.split(separator).join("");
  },
  reverse(data, separator = "/") {
    return data.split(separator).reverse().join(separator);
  },
  clearAndReverse(data, separator = "/", joinString = "") {
    return data.split(separator).reverse().join(joinString);
  }
};