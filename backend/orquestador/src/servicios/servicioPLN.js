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
        url: this.#configuracion.url + 'buscarSimilitudIntenciones',
        data: JSON.stringify(data),
      };
      const res = await axios(newConfig);
      return await res.data;
    } catch (err) {
      console.log(err);
      return null;
    }
  };
  BuscarSimilitudPalabras = async (clienteDice, palabras) => {
    try {
      const newConfig = {
        ...this.#configuracion,
        url: this.#configuracion.url + 'buscarSimilitudPalabras',
        data: JSON.stringify({clienteDice, palabras}),
      };
      const res = await axios(newConfig);
      return await res.data;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  BuscarSimilitudProductos = async (clienteDice, productos) => {
    try {
      const newConfig = {
        ...this.#configuracion,
        url: this.#configuracion.url + 'buscarSimilitudProductos',
        data: JSON.stringify({clienteDice, productos}),
      };
      const res = await axios(newConfig);
      return await res.data;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}

module.exports = { ServicioPLN };
