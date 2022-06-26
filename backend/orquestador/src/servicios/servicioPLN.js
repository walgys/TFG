const axios = require('axios');

class ServicioPLN {
  static #instancia;
  #configuracion;
  constructor() {
    this.#configuracion = {
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
        ...this.#configuracion,
        url: this.#configuracion.url + 'buscarSimilitud',
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
