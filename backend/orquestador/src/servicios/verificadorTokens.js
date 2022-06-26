const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

class VerificadorTokens {
  static #instancia;
  #secret;
  constructor() {
    const rawdata = fs.readFileSync(
      path.resolve(__dirname, '../../../certs/jwt.json')
    );
    const data = JSON.parse(rawdata);
    this.#secret = data.secret;
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
      return jwt.verify(token, this.#secret);
    } catch (err) {
      return { error: err };
    }
  };

  generarTokenWebchat = ({ idNegocio, idCanal, idCliente }) => {
    return jwt.sign(
      { idNegocio: idNegocio, idCanal: idCanal, idCliente: idCliente },
      this.#secret,
      { expiresIn: '7d' }
    );
    //generear jwt para el webchat
  };

  generarTokenConsola = ({ negocio, uid }) => {
    return jwt.sign({ idNegocio: negocio, uid: uid }, this.#secret, {
      expiresIn: '7d',
    });
  };

  buscarEstadoCuenta = () => {};

  crearPedido = () => {};
  crearConsulta = () => {};
}

module.exports = { VerificadorTokens };
