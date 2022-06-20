const axios = require('axios');

class ServicioPLN {
  static #instancia;
  #config;
  constructor() {
    this.#config = {
      method: 'POST',
      url: 'http://localhost:5000/',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    console.log('ServicioPLN');
  }

  static getInstancia() {
    if (!this.#instancia) {
      this.#instancia = new ServicioPLN();
    }
    return this.#instancia;
  }
  buscarSimilitud = async (data) => {
    try {
      const newConfig = {
        ...this.#config,
        url: this.#config.url + 'buscarSimilitud',
        data: JSON.stringify(data),
      };
      const res = await axios(newConfig);
      return await res.data;
    } catch (err) {
      console.log(err);
      return null;
    }
  };
}

module.exports = { ServicioPLN };
