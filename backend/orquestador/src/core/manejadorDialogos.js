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
    const { idCliente, idNegocio, cuerpo } = JSON.parse(mensaje);
    const { texto } = cuerpo;
    const datosCliente = await this.#manejadorDatosInternos.buscarCliente({
      idCliente,
    });

    const { topico, botActivado, agenteAsignado } = datosCliente.estadoCliente;

    let { intencionEnEjecucion, ultimaRegla, proximaRegla } =
      datosCliente.estadoCliente;

    let mejorIntencion;

    if (botActivado) {
      if (intencionEnEjecucion !== '') {
        mejorIntencion =
          await this.#manejadorDatosInternos.buscarIntencionPorId(
            intencionEnEjecucion
          );
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
        let intencionCumplida;
        let reglaAEjecutar;
        let indiceReglaAEjecutar = 0;
        let datosClienteActualizado;
        while (mejorIntencion.reglas.length > indiceReglaAEjecutar) {
          if (intencionEnEjecucion != '') {
            if (proximaRegla !== '') {
              if (proximaRegla == 'intencionCumplida') {
                intencionCumplida = true;
              }
              mejorIntencion.reglas.forEach((regla, indice) => {
                if (regla.id === proximaRegla) {
                  reglaAEjecutar = regla;
                  indiceReglaAEjecutar = indice;
                }
              });
              if (!reglaAEjecutar) {
                intencionCumplida = true;
              }
            } else {
              reglaAEjecutar = mejorIntencion.reglas[0];
            }
          } else if (ultimaRegla === '' && proximaRegla === '') {
            reglaAEjecutar = mejorIntencion.reglas[0];
          }

          if (!intencionCumplida) {
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
                configuracionRegla: reglaAEjecutar.configuracion,
              };

              const resultado =
                reglaEncontrada.ejecutarRegla(objetoConfiguracion);

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

                this.#servicioColasMensajes.agregarMensaje({
                  topico: 'orquestadorManejadorDialogos',
                  mensaje: this.#mensaje,
                });
              } else {
                if (mejorIntencion.reglas.length - 1 === indiceReglaAEjecutar) {
                  datosClienteActualizado = {
                    ...datosCliente,
                    estadoCliente: {
                      ...datosCliente.estadoCliente,
                      intencionEnEjecucion: '',
                      ultimaRegla: '',
                      proximaRegla: 'intencionCumplida',
                    },
                  };
                } else {
                  intencionEnEjecucion = mejorIntencion.id;
                  ultimaRegla = reglaAEjecutar.id;
                  proximaRegla =
                    mejorIntencion.reglas.length - 1 === indiceReglaAEjecutar
                      ? ''
                      : mejorIntencion.reglas[indiceReglaAEjecutar + 1].id;

                  datosClienteActualizado = {
                    ...datosCliente,
                    estadoCliente: {
                      ...datosCliente.estadoCliente,
                      intencionEnEjecucion: intencionEnEjecucion,
                      estadoIntencion: '',
                      ultimaRegla: ultimaRegla,
                      proximaRegla: proximaRegla,
                    },
                  };
                }
              }
              this.#manejadorDatosInternos.actualizarDatosCliente(
                datosClienteActualizado,
                idCliente
              );
              indiceReglaAEjecutar += 1;
              if (reglaAEjecutar.configuracion?.necesitaRespuesta) return;
            }
          } else {
            datosClienteActualizado = {
              ...datosCliente,
              estadoCliente: {
                ...datosCliente.estadoCliente,
                intencionEnEjecucion: '',
                ultimaRegla: '',
                proximaRegla: '',
              },
            };
            this.#manejadorDatosInternos.actualizarDatosCliente(
              datosClienteActualizado,
              idCliente
            );
            indiceReglaAEjecutar += 1;
          }
        }
      }
    } else if (agenteAsignado !== '') {
      //reenviar a agente los mensajes.
    }
    this.#terminar({ uuid: this.#uuid, resultado: mejorIntencion });
  };
}

module.exports = { ManejadorDialogos };
