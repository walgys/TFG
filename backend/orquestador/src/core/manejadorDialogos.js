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
    mensajeEntrante,
    terminar,
    servicioColasMensajes,
  }) {
    this.#administradorEntidades = administradorEntidades;
    this.#manejadorDatosExternos = manejadorDatosExternos;
    this.#manejadorDatosInternos = manejadorDatosInternos;
    this.#servicioPLN = servicioPLN;
    this.#uuid = uuid;
    this.#mensaje = mensajeEntrante;
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

    let { intencionEnEjecucion, ultimaRegla, esperaRespuesta } =
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

        if (
          intencionesSimilares?.similarities[0]?.intencion !== 'NO_ENTIENDE'
        ) {
          const intencion = await this.#manejadorDatosInternos.buscarIntencion(
            idNegocio,
            'NO_ENTIENDE'
          );
          mejorIntencion = intencion.shift();
        } else if (intencionesSimilares?.similarities[0]?.similarity > 0.5) {
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
      const ejecucionSimpleDeRegla = async () => {
        const reglaEncontrada = await this.#administradorReglas.buscarRegla(
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

          const resultado = await reglaEncontrada.ejecutarRegla(
            objetoConfiguracion
          );

          if (resultado.cambioIntencion) {
            datosClienteActualizado = {
              ...datosCliente,
              estadoCliente: {
                ...datosCliente.estadoCliente,
                intencionEnEjecucion: resultado.nuevaIntencion,
                ultimaRegla: '',
                esperaRespuesta: false
              },
            };
            await this.#manejadorDatosInternos.actualizarDatosCliente(
              datosClienteActualizado,
              idCliente
            );
            await this.#servicioColasMensajes.agregarMensaje({
              topico: 'orquestadorManejadorDialogos',
              mensaje: this.#mensaje,
            });
            indiceReglaAEjecutar = mejorIntencion?.reglas?.length;
            return;
          } else {
            //no es cambio de intención
            const esperaRespuesta = reglaAEjecutar.tipo === 'MENU' || reglaAEjecutar.tipo === 'PREGUNTAR';
            datosClienteActualizado = {
              ...datosCliente,
              estadoCliente: {
                ...datosCliente.estadoCliente,
                ultimaRegla: reglaAEjecutar,
                esperaRespuesta
              },
            };
            await this.#manejadorDatosInternos.actualizarDatosCliente(
              datosClienteActualizado,
              idCliente
            );
            ultimaRegla = reglaAEjecutar;
            if(reglaAEjecutar.tipo === 'MENU' || reglaAEjecutar.tipo === 'PREGUNTAR') {
              indiceReglaAEjecutar = mejorIntencion?.reglas?.length;
              return;
           }
          }
        } else {
          // no encontró tipo de regla
        }
      }
      const tiposQueEsperanRespuesta = ['PREGUNTAR','MENU','BUSCAR_PRODUCTO']

      while (mejorIntencion?.reglas?.length > indiceReglaAEjecutar) {
        reglaAEjecutar = mejorIntencion.reglas[indiceReglaAEjecutar];
          if (!!esperaRespuesta && tiposQueEsperanRespuesta.includes(reglaAEjecutar.tipo)){
            if(reglaAEjecutar.tipo === 'BUSCAR_PRODUCTO'){
              
            }
            if(reglaAEjecutar.tipo === 'PREGUNTAR'){
              datosClienteActualizado = {
                ...datosCliente,
                estadoCliente: {
                  ...datosCliente.estadoCliente,
                  variablesCliente:[
                    ...datosCliente.estadoCliente.variablesCliente,
                    {nombre: reglaAEjecutar.configuracion.variableDestino, valor: texto}
                  ]
                },
              };
              await this.#manejadorDatosInternos.actualizarDatosCliente(
                datosClienteActualizado,
                idCliente
              );
            }
            if(reglaAEjecutar.tipo === 'MENU')
          {
            if (!!opcion) {
              if (opcion.accion == 'IR_INTENCION') {
                datosClienteActualizado = {
                  ...datosCliente,
                  estadoCliente: {
                    ...datosCliente.estadoCliente,
                    intencionEnEjecucion: opcion.idIntencion,
                    topico: '',
                    ultimaRegla: '',
                    esperaRespuesta: false
                  },
                };
                await this.#manejadorDatosInternos.actualizarDatosCliente(
                  datosClienteActualizado,
                  idCliente
                );
                await this.#servicioColasMensajes.agregarMensaje({
                  topico: 'orquestadorManejadorDialogos',
                  mensaje: this.#mensaje,
                });
                indiceReglaAEjecutar = mejorIntencion?.reglas?.length;
                return;
              }
            } else {
              let nuevoMensaje = { ...this.#mensaje };
              const opcionEncontrada =
              reglaAEjecutar.configuracion.opciones.find(
                  (opcionRegla) =>
                    opcionRegla.texto.toLowerCase() === texto.toLowerCase()
                );
              if (!!opcionEncontrada) {
                //acciones de intencion encontrada
                if (opcionEncontrada.accion == 'IR_INTENCION') {
                  datosClienteActualizado = {
                    ...datosCliente,
                    estadoCliente: {
                      ...datosCliente.estadoCliente,
                      intencionEnEjecucion: opcionEncontrada.idIntencion,
                      topico: '',
                      ultimaRegla: '',
                      esperaRespuesta: false
                    },
                  };
                  const mensajeDatos = JSON.parse(this.#mensaje.datos.mensaje);
                  nuevoMensaje = {
                    ...this.#mensaje,
                    datos: {
                      ...this.#mensaje.datos,
                      mensaje: JSON.stringify({
                        ...mensajeDatos,
                        cuerpo: {
                          ...mensajeDatos.cuerpo,
                          opcion: opcionEncontrada,
                        },
                      }),
                    },
                  };
                }
              } else {
                  //default a repregunta
                  datosClienteActualizado = {
                    ...datosCliente,
                    estadoCliente: {
                      ...datosCliente.estadoCliente,
                      intencionEnEjecucion: intencionEnEjecucion,
                      ultimaRegla: '',
                      esperaRespuesta: false
                    },
                  };
                }
                await this.#manejadorDatosInternos.actualizarDatosCliente(
                  datosClienteActualizado,
                  idCliente
                );
                await this.#servicioColasMensajes.agregarMensaje({
                  topico: 'orquestadorManejadorDialogos',
                  mensaje: nuevoMensaje,
                });
                indiceReglaAEjecutar = mejorIntencion?.reglas?.length;
                return;
              }
          }

        }else{
            await ejecucionSimpleDeRegla();
          }

        indiceReglaAEjecutar += 1;
      }
    } else if (agenteAsignado !== '') {
      //reenviar a agente los mensajes.
    }
    this.#terminar({ uuid: this.#uuid, resultado: mejorIntencion });
  };
}

module.exports = { ManejadorDialogos };
