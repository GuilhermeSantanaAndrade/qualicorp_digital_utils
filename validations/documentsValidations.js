const cpf = {
  unformat(cpf) {
    return cpf.replace(/\-|\./g, "");
  },
  isValid(unformatedCpf) {
    var Soma;
    var Resto;
    Soma = 0;

    // Elimina CPFs invalidos conhecidos
    if (unformatedCpf == "00000000000" ||
      unformatedCpf == "11111111111" ||
      unformatedCpf == "22222222222" ||
      unformatedCpf == "33333333333" ||
      unformatedCpf == "44444444444" ||
      unformatedCpf == "55555555555" ||
      unformatedCpf == "66666666666" ||
      unformatedCpf == "77777777777" ||
      unformatedCpf == "88888888888" ||
      unformatedCpf == "99999999999") {
      return false;
    }

    for (var i = 1; i <= 9; i++)
      Soma = Soma + parseInt(unformatedCpf.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))
      Resto = 0;

    if (Resto != parseInt(unformatedCpf.substring(9, 10)))
      return false;

    Soma = 0;
    for (var i = 1; i <= 10; i++)
      Soma = Soma + parseInt(unformatedCpf.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))
      Resto = 0;
    if (Resto != parseInt(unformatedCpf.substring(10, 11)))
      return false;

    return true;
  }
};

const cnpj = {
  isValid(value) {
    if (!value) return false

    // Aceita receber o valor como string, número ou array com todos os dígitos
    const validTypes =
      typeof value === 'string' || Number.isInteger(value) || Array.isArray(value)

    // Elimina valor em formato inválido
    if (!validTypes) return false

    // Guarda um array com todos os dígitos do valor
    const match = value.toString().match(/\d/g)
    const numbers = Array.isArray(match) ? match.map(Number) : []

    // Valida a quantidade de dígitos
    if (numbers.length !== 14) return false

    // Elimina inválidos com todos os dígitos iguais
    const items = [...new Set(numbers)]
    if (items.length === 1) return false

    // Cálculo validador
    const calc = (x) => {
      const slice = numbers.slice(0, x)
      let factor = x - 7
      let sum = 0

      for (let i = x; i >= 1; i--) {
        const n = slice[x - i]
        sum += n * factor--
        if (factor < 2) factor = 9
      }

      const result = 11 - (sum % 11)

      return result > 9 ? 0 : result
    }

    // Separa os 2 últimos dígitos de verificadores
    const digits = numbers.slice(12)

    // Valida 1o. dígito verificador
    const digit0 = calc(12)
    if (digit0 !== digits[0]) return false

    // Valida 2o. dígito verificador
    const digit1 = calc(13)
    return digit1 === digits[1]
  }
}

module.exports = {
  cpf,
  cnpj
}