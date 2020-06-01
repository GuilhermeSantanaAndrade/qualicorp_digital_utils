# Qualicorp Digital (funções úteis)

###### exemplo de uso:
```js
const { setupEnvironment, responseStructs, AppError, handle404, validations } = require("@qualicorp_digital/utils");
```
### setupEnviroment

Essa função é comumente usada no ato de inicialização das APIs para atribuir as variáveis de ambiente de acordo com o arquivo .env correspondente ao ambiente da execução.
Recomendável realizar a chamda da função setuopEnviroment() antes das rotas.

###### exemplo de uso:
```js
const express = require("express");
const app = express();
const { setupEnviroment } = require("@qualicorp_digital/utils");
setupEnviroment();
```

### responseStructs

Detém as funções que padronizam as responses das APIs, são elas:

#### responseSuccess(res, data, status = 200)
"res" é o objeto response do express.
"data" é o resultado da API, sendo geralmente um objeto ou um array.
"status" statusCode da response. Se não for atribuído assumirá 200 (sucesso).

#### responseError(res, error, status = 500)
"res" é o objeto response do express.
"error" é o objeto de erro externado pelo trow. Geralmente será uma string com o erro ou um objeto contendo a propriedade message.
"status" statusCode da response. Se não for atribuído assumirá 500 (erro interno).