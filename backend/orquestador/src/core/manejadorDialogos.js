class ManejadorDialogos {
  #administradorEntidades;
  #manejadorDatosExternos;
  #manejadorDatosInternos;
  #servicioPLN;
  #uuid;
  #estado;
  #mensaje;
  #terminar;
  #administradorReglas;
  #servicioColasMensajes;

  constructor({
    administradorEntidades,
    manejadorDatosExternos,
    manejadorDatosInternos,
    administradorReglas,
    servicioPLN,
    uuid,
    mensaje,
    terminar,
    servicioColasMensajes,
  }) {
    this.#administradorEntidades = administradorEntidades;
    this.#manejadorDatosExternos = manejadorDatosExternos;
    this.#manejadorDatosInternos = manejadorDatosInternos;
    this.#servicioPLN = servicioPLN;
    this.#uuid = uuid;
    this.#mensaje = mensaje;
    this.#terminar = terminar;
    this.#administradorReglas = administradorReglas;
    this.#servicioColasMensajes = servicioColasMensajes;
    this.#procesarMensaje();
    console.log('ManejadorDialogos');
  }

  #procesarMensaje = async () => {
    const { idSocket, mensaje } = this.#mensaje.datos;
    const { idCliente, idNegocio, texto } = JSON.parse(mensaje);

    const datosCliente = await this.#manejadorDatosInternos.buscarCliente({
      idCliente,
    });

    const {
      topico,
      intencionEnEjecucion,
      ultimaRegla,
      proximaRegla,
      botActivado,
      agenteAsignado,
    } = datosCliente.estadoCliente;
    let mejorIntencion;

    if (botActivado) {
      if (intencionEnEjecucion !== '') {
        mejorIntencion =
          this.#manejadorDatosInternos.buscarIntencion(intencionEnEjecucion);
      }
      if (
        intencionEnEjecucion == '' ||
        (!!mejorIntencion && mejorIntencion.puedeDispararOtraIntencion)
      ) {
        const data = {
          idNegocio: idNegocio,
          contexto: {
            topico: topico,
          },
          clienteDice: texto,
        };
        const intencionesSimilares = await this.#servicioPLN.buscarSimilitud(
          data
        );
        mejorIntencion = intencionesSimilares?.similarities?.shift().intention;
      }

      //continuar aqui
      if (mejorIntencion.intencion !== 'NO_ENTIENDE') {
        let reglaAEjecutar;
        let indiceReglaAEjecutar = 0;
        while (mejorIntencion.reglas.length > indiceReglaAEjecutar) {
          if (ultimaRegla === '' && proximaRegla === '') {
            reglaAEjecutar = mejorIntencion.reglas[0];
          } else if (proximaRegla !== '') {
            mejorIntencion.reglas.forEach((regla, indice) => {
              if (regla.id === proximaRegla) {
                reglaAEjecutar = regla;
                indiceReglaAEjecutar = indice;
              }
            });
          }
          const reglaEncontrada = this.#administradorReglas.buscarRegla(
            reglaAEjecutar.tipo
          );
          if (reglaEncontrada) {
            let objetoConfiguracion = {
              administradorEntidades: this.#administradorEntidades,
              manejadorDatosExternos: this.#manejadorDatosExternos,
              manejadorDatosInternos: this.#manejadorDatosInternos,
              servicioColasMensajes: this.#servicioColasMensajes,
              mensajeEntrante: this.#mensaje,
            };

            if (reglaAEjecutar.configuracion.texto) {
              objetoConfiguracion = {
                ...objetoConfiguracion,
                texto: reglaAEjecutar.configuracion.texto,
              };
            }
            const resultado =
              reglaEncontrada.ejecutarRegla(objetoConfiguracion);

            let datosClienteActualizado;
            if (resultado.cambioIntencion) {
              datosClienteActualizado = {
                ...datosCliente,
                estadoCliente: {
                  ...datosCliente.estadoCliente,
                  intencionEnEjecucion: resultado.nuevaIntencion,
                  ultimaRegla: '',
                  proximaRegla: '',
                },
              };
            } else {
              datosClienteActualizado = {
                ...datosCliente,
                estadoCliente: {
                  ...datosCliente.estadoCliente,
                  intencionEnEjecucion: mejorIntencion.id,
                  estadoIntencion: '',
                  ultimaRegla: reglaAEjecutar.id,
                  proximaRegla:
                    mejorIntencion.reglas.length - 1 === indiceReglaAEjecutar
                      ? ''
                      : mejorIntencion.reglas[indiceReglaAEjecutar + 1].id,
                },
              };
            }
            this.#manejadorDatosInternos.actualizarDatosCliente(
              datosClienteActualizado,
              idCliente
            );
            indiceReglaAEjecutar += 1;
            if (reglaAEjecutar.configuracion?.necesitaRespuesta) return;
          }
        }
      }

      console.log(mejorIntencion);
    } else if (agenteAsignado !== '') {
      //reenviar a agente los mensajes.
    }
    this.#terminar({ uuid: this.#uuid, resultado: mejorIntencion });
  };
}

module.exports = { ManejadorDialogos };
