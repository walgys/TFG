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
    const { texto, opcion } = cuerpo;
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
        (!!mejorIntencion &&
          mejorIntencion.puedeDispararOtraIntencion &&
          !opcion)
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
        
        if (intencionesSimilares?.similarities[0]?.intencion !== 'NO_ENTIENDE'){
          const intencion = await this.#manejadorDatosInternos.buscarIntencion(
            idNegocio,
            'NO_ENTIENDE'
          );
          mejorIntencion = intencion.shift();
        } else if(intencionesSimilares?.similarities[0]?.similarity > 0.5) {
          mejorIntencion =
            intencionesSimilares?.similarities?.shift().intention;
        } else {
          const intencion = await this.#manejadorDatosInternos.buscarIntencion(
            idNegocio,
            'NO_ENTIENDE'
          );
          mejorIntencion = intencion.shift();
        }
      }

      //continuar aqui

      let intencionCumplida;
      let reglaAEjecutar;
      let indiceReglaAEjecutar = 0;
      let datosClienteActualizado;
      while (mejorIntencion?.reglas?.length > indiceReglaAEjecutar) {
        if (intencionEnEjecucion != '') {
          if (ultimaRegla.tipo == 'MENU') {
            if (!!opcion && opcion.accion == 'IR_INTENCION') {
              datosClienteActualizado = {
                ...datosCliente,
                estadoCliente: {
                  ...datosCliente.estadoCliente,
                  intencionEnEjecucion: opcion.idIntencion,
                  topico: '',
                  ultimaRegla: '',
                  proximaRegla: '',
                },
              };
              this.#manejadorDatosInternos.actualizarDatosCliente(
                datosClienteActualizado,
                idCliente
              );
              this.#servicioColasMensajes.agregarMensaje({
                topico: 'orquestadorManejadorDialogos',
                mensaje: this.#mensaje,
              });
            proximaRegla = 'intencionCumplida';  
            }
            
          }


          if (proximaRegla !== '') {
            if (proximaRegla == 'intencionCumplida') {
              intencionCumplida = true;
            } else {
              mejorIntencion.reglas.forEach((regla, indice) => {
                if (regla.id === proximaRegla.id) {
                  reglaAEjecutar = regla;
                  indiceReglaAEjecutar = indice;
                }
              });

              if (!reglaAEjecutar) {
                intencionCumplida = true;
              }
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
              this.#manejadorDatosInternos.actualizarDatosCliente(
                datosClienteActualizado,
                idCliente
              );
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
                    topico: mejorIntencion.topico,
                    intencionEnEjecucion: '',
                    ultimaRegla: '',
                    proximaRegla: '',
                  },
                };
              } else {
                intencionEnEjecucion = mejorIntencion.id;
                ultimaRegla = reglaAEjecutar;
                proximaRegla =
                  mejorIntencion.reglas.length - 1 === indiceReglaAEjecutar
                    ? ''
                    : mejorIntencion.reglas[indiceReglaAEjecutar + 1];

                datosClienteActualizado = {
                  ...datosCliente,
                  estadoCliente: {
                    ...datosCliente.estadoCliente,
                    intencionEnEjecucion: intencionEnEjecucion,
                    topico: mejorIntencion.topico,
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
        } else if (!opcion) {
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
        }else{
          indiceReglaAEjecutar = mejorIntencion?.reglas?.length;
        }
      }
    } else if (agenteAsignado !== '') {
      //reenviar a agente los mensajes.
    }
    this.#terminar({ uuid: this.#uuid, resultado: mejorIntencion });
  };
}

module.exports = { ManejadorDialogos };
