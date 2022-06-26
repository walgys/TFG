const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

class VerificadorTokens {
  static #instancia;
  #secreto;
  constructor() {
    const datosLeidos = fs.readFileSync(
      path.resolve(__dirname, '../../../certs/jwt.json')
    );
    const datos = JSON.parse(datosLeidos);
    this.#secreto = datos.secret;
    console.log('VerificadorTokens');
  }

  static getInstancia() {
    if (!this.#instancia) {
      this.#instancia = new VerificadorTokens();
    }
    return this.#instancia;
  }

  verificarTokenFB = (token) => {
    try {
      return jwt.decode(token);
    } catch (err) {
      return { error: err };
    }
  };

  verificarTokenPlataforma = (token) => {
    try {
      return jwt.verify(token, this.#secreto);
    } catch (err) {
      return { error: err };
    }
  };

  generarTokenWebchat = ({ idNegocio, idCanal, idCliente }) => {
    return jwt.sign(
      { idNegocio: idNegocio, idCanal: idCanal, idCliente: idCliente },
      this.#secreto,
      { expiresIn: '7d' }
    );
    //generear jwt para el webchat
  };

  generarTokenConsola = ({ negocio, uid }) => {
    return jwt.sign({ idNegocio: negocio, uid: uid }, this.#secreto, {
      expiresIn: '7d',
    });
  };
}

module.exports = { VerificadorTokens };
