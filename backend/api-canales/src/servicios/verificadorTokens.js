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

  verificarTokenPlataforma = (token) => {
    try {
      return jwt.verify(token, this.#secret);
    } catch (err) {
      return { error: err };
    }
  };

  verificarTokenFirestore = () => {};

  generarTokenWebchat = ({ idNegocio, idCanal, idCliente }) => {
    return jwt.sign(
      { idNegocio: idNegocio, idCanal: idCanal, idCliente: idCliente },
      this.#secret,
      { expiresIn: '7d' }
    );
    //generear jwt para el webchat
  };

  buscarEstadoCuenta = () => {};

  crearPedido = () => {};
  crearConsulta = () => {};
}

module.exports = { VerificadorTokens };
