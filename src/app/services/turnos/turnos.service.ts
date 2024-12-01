import { Injectable } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Firestore, collection, collectionData, setDoc, DocumentData, doc, addDoc } from '@angular/fire/firestore';
import { getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { Auth } from '@angular/fire/auth';



@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  constructor(private firestore: Firestore, private auth: Auth) { }

  getUsuarios(): Observable<any[]> {
    const col = collection(this.firestore, "pacientes");

    const filteredQuery = query(
      col
    );

    return collectionData(filteredQuery); // Retorna el observable
  }

  getAdmins(): Observable<any[]> {
    const col = collection(this.firestore, "admins");

    const filteredQuery = query(
      col
    );

    return collectionData(filteredQuery); // Retorna el observable
  }


  getEspecialistas(): Observable<any[]> {
    const col = collection(this.firestore, "especialistas");

    const filteredQuery = query(
      col
    );

    return collectionData(filteredQuery); // Retorna el observable
  }


  getEspecialidad(): Observable<any[]> {
    const col = collection(this.firestore, "especialistas");

    const filteredQuery = query(
      col
    );

    return collectionData(filteredQuery); // Retorna el observable
  }

  getTurno(): Observable<any[]> {
    const col = collection(this.firestore, "turnos");

    const filteredQuery = query(
      col
    );

    return collectionData(filteredQuery); // Retorna el observable
  }



  sendturno(paciente: string, especialista: string, especialidad: string, horario: string, email: string, dia: string) {
    let col = collection(this.firestore, "turnos");

    let obj = {
      paciente: paciente,
      especialista: especialista,
      especialidad: especialidad,
      horario: horario,
      emailEspecialsita: email,
      estado: "pendiente",
      mensaje: "",
      diagnostico: "",
      comentario: "",
      dia: dia,
      altura: "",
      peso: "",
      comentarioPaciente : "",
      presion : "",
      temperatura: ""
    };



    addDoc(col, obj)
      .then(() => {
        console.log('turno agregado con éxito');
      })
      .catch((error) => {
        console.error('Error al agregar turno: ', error);
      });

  }

  getTurnos(): Observable<any[]> {
    const col = collection(this.firestore, "turnos");

    const filteredQuery = query(
      col
    );

    return collectionData(filteredQuery); // Retorna el observable
  }

  getPacientes(): Observable<any[]> {
    const col = collection(this.firestore, "pacientes");

    const filteredQuery = query(
      col
    );

    return collectionData(filteredQuery); // Retorna el observable
  }

  getadmin(): Observable<any[]> {
    const col = collection(this.firestore, "admins");

    const filteredQuery = query(
      col
    );

    return collectionData(filteredQuery); // Retorna el observable
  }


  getHistoriaClinica(): Observable<any[]> {
    const col = collection(this.firestore, "turnos");

    const filteredQuery = query(
      col
    );

    return collectionData(filteredQuery); // Retorna el observable
  }


  getUsers(): Observable<any[]> {
    const col = collection(this.firestore, "pacientes");

    const filteredQuery = query(
      col
    );

    return collectionData(filteredQuery); // Retorna el observable
  }



  ingresarEstado(estado: string, paciente: string, horario: string) {
    // Crear una referencia a la colección
    const coleccionRef = collection(this.firestore, "turnos");

    // Crear una consulta que busque los documentos donde el paciente y el horario coinciden
    const consulta = query(
      coleccionRef,
      where("paciente", "==", paciente),
      where("horario", "==", horario) // Validamos también el horario
    );

    // Obtener los documentos que coinciden con la consulta
    getDocs(consulta).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        // Si se encuentra al menos un documento, tomamos el primero
        const docSnap = querySnapshot.docs[0]; // Aquí obtenemos el primer documento
        const idTurno = docSnap.id; // Obtenemos el id del documento encontrado

        // Ahora puedes actualizar el campo 'estado' de este documento
        const turnoRef = doc(this.firestore, "turnos", idTurno);

        // Actualizamos el estado
        updateDoc(turnoRef, {
          estado: estado // Actualizamos el estado con el nuevo valor
        })
          .then(() => {
            console.log('Estado actualizado con éxito');
          })
          .catch((error) => {
            console.error('Error al actualizar el estado:', error);
          });

      } else {
        console.log("No se encontró el turno con el paciente y horario especificados.");
      }
    }).catch((error) => {
      console.error("Error al realizar la consulta:", error);
    });
  }


  ingresarMensaje(mensaje: string, paciente: string) {
    // Suponiendo que deseas buscar por email
    const nombreBuscado = paciente; // Cambia esto con el email que buscas

    // Crear una referencia a la colección
    const coleccionRef = collection(this.firestore, "turnos");

    // Crear una consulta que busque el documento donde el email coincide
    const consulta = query(coleccionRef, where("paciente", "==", nombreBuscado));

    // Obtener los documentos que coinciden con la consulta
    getDocs(consulta).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        // Si se encuentra al menos un documento, tomamos el primero
        const docSnap = querySnapshot.docs[0]; // Aquí obtenemos el primer documento
        const idEspecialista = docSnap.id; // Obtenemos el id del documento encontrado

        // Ahora puedes actualizar el campo 'nombre' de este documento
        const especialistaRef = doc(this.firestore, "turnos", idEspecialista);

        updateDoc(especialistaRef, {
          mensaje: mensaje // Cambia esto con el nuevo nombre que deseas asignar
        })

      } else {
        console.log("No se encontró el turno con ese email.");
      }
    }).catch((error) => {
      console.error("Error al realizar la consulta:", error);
    });
  }

  ingresarDiagnostico(mensaje: string, paciente: string, horario: string) {
    // Crear una referencia a la colección
    const coleccionRef = collection(this.firestore, "turnos");

    // Crear una consulta que busque los documentos donde el paciente y el horario coinciden
    const consulta = query(
      coleccionRef,
      where("paciente", "==", paciente),
      where("horario", "==", horario) // Validamos también el horario
    );

    // Obtener los documentos que coinciden con la consulta
    getDocs(consulta).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        // Si se encuentra al menos un documento, tomamos el primero
        const docSnap = querySnapshot.docs[0]; // Aquí obtenemos el primer documento
        const idTurno = docSnap.id; // Obtenemos el id del documento encontrado

        // Ahora puedes actualizar el campo 'estado' de este documento
        const turnoRef = doc(this.firestore, "turnos", idTurno);

        // Actualizamos el estado
        updateDoc(turnoRef, {
          diagnostico: mensaje // Actualizamos el estado con el nuevo valor
        })
          .then(() => {
            console.log('Estado actualizado con éxito');
          })
          .catch((error) => {
            console.error('Error al actualizar el estado:', error);
          });

      } else {
        console.log("No se encontró el turno con el paciente y horario especificados.");
      }
    }).catch((error) => {
      console.error("Error al realizar la consulta:", error);
    });
  }

  ingresarComentario(mensaje: string, paciente: string, horario: string) {
    // Crear una referencia a la colección
    const coleccionRef = collection(this.firestore, "turnos");

    // Crear una consulta que busque los documentos donde el paciente y el horario coinciden
    const consulta = query(
      coleccionRef,
      where("paciente", "==", paciente),
      where("horario", "==", horario) // Validamos también el horario
    );

    // Obtener los documentos que coinciden con la consulta
    getDocs(consulta).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        // Si se encuentra al menos un documento, tomamos el primero
        const docSnap = querySnapshot.docs[0]; // Aquí obtenemos el primer documento
        const idTurno = docSnap.id; // Obtenemos el id del documento encontrado

        // Ahora puedes actualizar el campo 'estado' de este documento
        const turnoRef = doc(this.firestore, "turnos", idTurno);

        // Actualizamos el estado
        updateDoc(turnoRef, {
          comentario: mensaje // Actualizamos el estado con el nuevo valor
        })
          .then(() => {
            console.log('Estado actualizado con éxito');
          })
          .catch((error) => {
            console.error('Error al actualizar el estado:', error);
          });

      } else {
        console.log("No se encontró el turno con el paciente y horario especificados.");
      }
    }).catch((error) => {
      console.error("Error al realizar la consulta:", error);
    });
  }

  ingresarComentarioPaciente(mensaje: string, paciente: string) {
    // Suponiendo que deseas buscar por email
    const nombreBuscado = paciente; // Cambia esto con el email que buscas

    // Crear una referencia a la colección
    const coleccionRef = collection(this.firestore, "turnos");

    // Crear una consulta que busque el documento donde el email coincide
    const consulta = query(coleccionRef, where("paciente", "==", nombreBuscado));

    // Obtener los documentos que coinciden con la consulta
    getDocs(consulta).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        // Si se encuentra al menos un documento, tomamos el primero
        const docSnap = querySnapshot.docs[0]; // Aquí obtenemos el primer documento
        const idEspecialista = docSnap.id; // Obtenemos el id del documento encontrado

        // Ahora puedes actualizar el campo 'nombre' de este documento
        const especialistaRef = doc(this.firestore, "turnos", idEspecialista);

        updateDoc(especialistaRef, {
          comentarioPaciente: mensaje // Cambia esto con el nuevo nombre que deseas asignar
        })

      } else {
        console.log("No se encontró el turno con ese email.");
      }
    }).catch((error) => {
      console.error("Error al realizar la consulta:", error);
    });
  }

  ingresarEncuestaPaciente(atencion: string, demora: string, limpieza: string, usuario: string, doctor : string) {
    let col = collection(this.firestore, "encuestas");

    let obj = {
      atencion: atencion,
      demora : demora,
      limpieza : limpieza,
      usuario : usuario,
      doctor : doctor
    };



    addDoc(col, obj)
      .then(() => {
        console.log('Encuesta agregad con éxito');
      })
      .catch((error) => {
        console.error('Error al agregar turno: ', error);
      });

  }

  

  getImagenesEspecialdiad(): Observable<any[]> {
    const col = collection(this.firestore, "imagenesEspecialidad");

    const filteredQuery = query(
      col
    );

    return collectionData(filteredQuery); // Retorna el observable
  }

  ingresarHistoriaClinica(
    altura: string,
    peso: string,
    temperatura: string,
    presion: string,
    NombredatodinamicoUno: string,
    NombredatodinamicoDos: string,
    datodinamicoUno: string,
    datodinamicoDos: string,
    emailPaciente: string,
    horario : string
  ) {
    // Crear una referencia a la colección "turnos"
    const coleccionRef = collection(this.firestore, "turnos");

    // Crear una consulta para buscar el documento del paciente
    const consulta = query(
      coleccionRef,
      where("paciente", "==", emailPaciente),
      where("horario", "==", horario) // Validamos también el horario
    );


    // Ejecutar la consulta
    getDocs(consulta)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          // Si se encuentra al menos un documento
          const docSnap = querySnapshot.docs[0];
          const idTurno = docSnap.id; // ID del documento encontrado

          // Crear referencia al documento para actualizar
          const turnoRef = doc(this.firestore, "turnos", idTurno);

          // Crear el objeto de actualización
          const datosActualizacion: any = {
            altura,
            peso,
            temperatura,
            presion,
          };

          // Añadir datos dinámicos si están definidos y son válidos
          if (NombredatodinamicoUno && datodinamicoUno && datodinamicoUno !== "undefined") {
            datosActualizacion[NombredatodinamicoUno] = datodinamicoUno;
          }

          if (NombredatodinamicoDos && datodinamicoDos && datodinamicoDos !== "undefined") {
            datosActualizacion[NombredatodinamicoDos] = datodinamicoDos;
          }

          // Actualizar el documento en Firestore
          updateDoc(turnoRef, datosActualizacion)
            .then(() => {
              console.log("Historia clínica actualizada correctamente.");
            })
            .catch((error) => {
              console.error("Error al actualizar el documento:", error);
            });
        } else {
          console.log("No se encontró el turno con ese email.");
        }
      })
      .catch((error) => {
        console.error("Error al realizar la consulta:", error);
      });
  }




}
