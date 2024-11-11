import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { getDoc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { Firestore, collection, collectionData,setDoc, DocumentData, doc, addDoc } from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';

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
      perfil : "paciente"
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
      perfil : "admin"
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
      let col = collection(this.firestore, "especialistas");

      let obj = { 
        nombre: nombre,
        apellido: apellido,
        edad: edad,
        dni: dni,
        email: email,
        clave: clave,
        especialista : especialista,
        perfil : "especialista"
      };



      addDoc(col, obj)
        .then(() => {
          console.log('especialista agregado con éxito');
        })
        .catch((error) => {
          console.error('Error al agregar especialista: ', error);
        });

    }

    getEspecialistas(name : any) 
    {
      const col = collection(this.firestore, name);

      const filteredQuery = query(
        col
      );
      return collectionData(filteredQuery); // Retorna el observable
    }


    ingresarHorario(horario : string)
    {
      // Suponiendo que deseas buscar por email
      const emailBuscado = "juan@gmail.com"; // Cambia esto con el email que buscas

      // Crear una referencia a la colección
      const coleccionRef = collection(this.firestore, "especialistas");

      // Crear una consulta que busque el documento donde el email coincide
      const consulta = query(coleccionRef, where("email", "==", emailBuscado));

      // Obtener los documentos que coinciden con la consulta
      getDocs(consulta).then((querySnapshot) => {
        if (!querySnapshot.empty) {
          // Si se encuentra al menos un documento, tomamos el primero
          const docSnap = querySnapshot.docs[0]; // Aquí obtenemos el primer documento
          const idEspecialista = docSnap.id; // Obtenemos el id del documento encontrado

          // Ahora puedes actualizar el campo 'nombre' de este documento
          const especialistaRef = doc(this.firestore, "especialistas", idEspecialista);
          
          updateDoc(especialistaRef, {
            horario: horario // Cambia esto con el nuevo nombre que deseas asignar
          })

        } else {
          console.log("No se encontró el especialista con ese email.");
        }
      }).catch((error) => {
        console.error("Error al realizar la consulta:", error);
      });
    }

   
  


}
