const Redis = require("ioredis");
const conversions = require("../conversions/index");
const moment = require('moment');
moment.locale("pt-br");

class RedisCache {
  constructor(config) {
    this.error = "";
    this.active = false;

    if (config.active) {
      if (!config.port || !config.host) {
        throw Error("Cache: Configuração inválida.")
      }
      
      this.redis = new Redis(config);

      this.redis.on("error", (error) => {
        this.error = error.message;
        this.active = false;
        console.log(`Cache Provider error on connect. ${this.error}`)
      });

      this.redis.on("connect", () => {
        this.error = "";
        this.active = true;
      })
    }
  }

  async save(key, value) {
    await this.redis.set(key, value);
  }

  async get(key) {
    const data = await this.redis.get(key);
    return data;
  }

  async invalidate(key) {
    await this.redis.del(key);
  }

  async invalidateAllWithKey(key) {
    let countDeleted = 0;

    const keys = await this.redis.keys(`*${key}*`)
    const pipeline = this.redis.pipeline();

    countDeleted += keys.length;

    keys.forEach(key => {
      pipeline.del(key);
    });

    pipeline.exec();
    
    return countDeleted;
  }

  checkCache(cacheOptions) {
    return async (req, res, next) => {
      if (!cacheOptions || !this.active) {
        return next();
      }

      try {
        let propertiesToHash = {};

        if (cacheOptions.includes.headers) {
          propertiesToHash.headers = {};
          const allProps = cacheOptions.includes.headers.findIndex(item => item === "*") > -1;

          if (allProps) {
            for (const prop in req.headers) {
              propertiesToHash.headers[prop] = req.headers[prop];
            }
          } else {
            for (const prop of cacheOptions.includes.headers) {
              propertiesToHash.headers[prop] = req.headers[prop];
            }
          }
        }

        if (cacheOptions.cachePerUser) {
          propertiesToHash.user = req.user;
        }

        if (cacheOptions.includes.query) {
          propertiesToHash.query = {};
          const allProps = cacheOptions.includes.query.findIndex(item => item === "*") > -1;

          if (allProps) {
            for (const prop in req.query) {
              propertiesToHash.query[prop] = req.query[prop];
            }
          } else {
            for (const prop of cacheOptions.includes.query) {
              propertiesToHash.query[prop] = req.query[prop];
            }
          }
        }

        if (cacheOptions.includes.params) {
          propertiesToHash.params = {};
          const allProps = cacheOptions.includes.params.findIndex(item => item === "*") > -1;

          if (allProps) {
            for (const prop in req.params) {
              propertiesToHash.params[prop] = req.params[prop];
            }
          } else {
            for (const prop of cacheOptions.includes.params) {
              propertiesToHash.params[prop] = req.params[prop];
            }
          }
        }

        if (cacheOptions.includes.body) {
          propertiesToHash.body = {};
          const allProps = cacheOptions.includes.body.findIndex(item => item === "*") > -1;

          if (allProps) {
            for (const prop in req.body) {
              propertiesToHash.body[prop] = req.body[prop];
            }
          } else {
            for (const prop of cacheOptions.includes.body) {
              propertiesToHash.body[prop] = req.body[prop];
            }
          }
        }

        const finalJson = JSON.stringify(propertiesToHash);
        let sha = conversions.hashs.sha.encode(finalJson);

        const key = `${cacheOptions.type}|${cacheOptions.name}|${cacheOptions.guid}|${sha}`;
        req.headers.cacheKey = key;

        let cache = await this.get(key);

        if (cache) {
          try {
            cache = JSON.parse(cache);
            
            if (
                (cache.timestampGeracao === undefined) || 
                (typeof cache.timestampGeracao !== "number") || 
                (typeof cache.data !== "object") || 
                (typeof cacheOptions.expires !== "number")
              ) {
              throw Error();
            }

            const timestampNow = moment().toDate().getTime();
            const diffTime = timestampNow - cache.timestampGeracao;
            const resStatus = cache.status || 200;

            if (diffTime > cacheOptions.expires) {
              await this.invalidate(key);
            } else {
              res.set('isCache', true);
              res.status(resStatus).json(cache.data);
              return;
            }
          } catch (err) {
            await this.invalidate(key);
          }
        }
      } catch(err) {
      }
      
      return next();    
    }
  }

  saveCache(cacheOptions) {
    return async (req, res, next) => {
      if (!cacheOptions || !this.active || !req.headers.cacheKey || !res.customData) {
        return;
      }

      try {
        const key = req.headers.cacheKey;
        const json = res.customData;
        let value = {
          timestampGeracao: moment().toDate().getTime(),
          status: res.customStatus || 200,
          data: json
        };
        value = JSON.stringify(value);

        await this.save(key, value);
      } catch (err) {
      }
    }
  }

  clearCache(routesConfig) {
    return async (req, res, next) => {
      if (!routesConfig || (typeof routesConfig !== "object")) {
        throw new Error("Não foi informado parâmetro routesConfig.")
      }

      if (!this.active) {
        throw new Error("Cache não foi inicializado corretamente. (active = false)")
      }

      const all = !req.params.guid;
      let countDeleted = 0;

      for (const httpVerb in routesConfig) {
        const configs = routesConfig[httpVerb];

        if (typeof configs !== "object") {
          continue;
        }

        for (const prop in configs) {
          const conf = configs[prop];

          if (conf.guid && (all || conf.guid === req.params.guid)) {
            countDeleted += await this.invalidateAllWithKey(conf.guid);
          }
        }
      }
      
      res.json({ 
        deleted: countDeleted,
        message: "OK" 
      })
    }
  }
}

exports.getCacheProvider = function (config) {
  if (!config || (typeof config !== "object")) {
    throw Error("Cache: Não foi informada configuração de conexão.")
  }
  
  const cacheProvider = new RedisCache(config);
  return cacheProvider;
}