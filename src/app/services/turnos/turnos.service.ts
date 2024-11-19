import { Injectable } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Firestore, collection, collectionData,setDoc, DocumentData, doc, addDoc } from '@angular/fire/firestore';
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


  sendturno(paciente : string, especialista : string, especialidad : string, horario : string, email : string) 
    {
      let col = collection(this.firestore, "turnos");

      let obj = { 
        paciente: paciente,
        especialista: especialista,
        especialidad: especialidad,
        horario: horario,
        emailEspecialsita : email,
        estado: "pendiente",
        mensaje: ""
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

    ingresarEstado(estado : string, paciente : string)
    {
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
            estado: estado // Cambia esto con el nuevo nombre que deseas asignar
          })

        } else {
          console.log("No se encontró el turno con ese email.");
        }
      }).catch((error) => {
        console.error("Error al realizar la consulta:", error);
      });
    }

    ingresarMensaje(mensaje : string, paciente : string)
    {
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

}
