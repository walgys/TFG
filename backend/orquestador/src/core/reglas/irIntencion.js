class IR_INTENCION {
  ejecutarRegla = ({ configuracionRegla }) => {
    const { idIntencion } = configuracionRegla;
    return { cambioIntencion: true, nuevaIntencion: idIntencion };
  };
}

module.exports = { IR_INTENCION };
