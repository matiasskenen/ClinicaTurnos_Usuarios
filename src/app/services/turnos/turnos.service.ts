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

}
