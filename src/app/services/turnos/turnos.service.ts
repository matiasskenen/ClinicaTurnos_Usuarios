import { Injectable } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Firestore, collection, collectionData,setDoc, DocumentData, doc, addDoc } from '@angular/fire/firestore';
import { orderBy, query, where } from 'firebase/firestore';
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
        emailEspecialsita : email
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

}
