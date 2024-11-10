import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { orderBy, query, where } from 'firebase/firestore';
import { Firestore, collection, collectionData,setDoc, DocumentData, doc, addDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private firestore: Firestore, private auth: Auth) {}

  sendPaciente(nombre : string, apellido : string, edad : number, dni : number, obrasocial : string, email : string, clave : string) 
  {
    
    console.log(nombre)
    let col = collection(this.firestore, "pacientes");

    let obj = { 
      nombre: nombre,
      apellido: apellido,
      edad: edad,
      dni: dni,
      obrasocial: obrasocial,
      email: email,
      clave: clave,
    };


    addDoc(col, obj)
      .then(() => {
        console.log('Paciente agregado con éxito');
      })
      .catch((error) => {
        console.error('Error al agregar Paciente: ', error);
      });

  }

  sendAdmin(nombre : string, apellido : string, edad : number, dni : number, email : string, clave : string) 
  {
    
    console.log(nombre)
    let col = collection(this.firestore, "admins");

    let obj = { 
      nombre: nombre,
      apellido: apellido,
      edad: edad,
      dni: dni,
      email: email,
      clave: clave,
    };


    addDoc(col, obj)
      .then(() => {
        console.log('Admin agregado con éxito');
      })
      .catch((error) => {
        console.error('Error al agregar Admin: ', error);
      });

  }

  sendEspecialista(nombre : string, apellido : string, edad : number, dni : number, email : string, clave : string, especialista : any) 
  {
    
    console.log(nombre)
    let col = collection(this.firestore, "admins");

    let obj = { 
      nombre: nombre,
      apellido: apellido,
      edad: edad,
      dni: dni,
      email: email,
      clave: clave,
      especialista : especialista
    };


    addDoc(col, obj)
      .then(() => {
        console.log('especialista agregado con éxito');
      })
      .catch((error) => {
        console.error('Error al agregar especialista: ', error);
      });

  }

}
