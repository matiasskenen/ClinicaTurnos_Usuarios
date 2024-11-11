import { CommonModule } from '@angular/common';import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, collection, collectionData,setDoc, DocumentData, doc, addDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { orderBy, query, where } from 'firebase/firestore';
import { Observable, Subscription } from 'rxjs';
import { DataService } from '../../services/authUsers/data.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})



/*
export class LoginComponent {
  public email: string = '';
  public password: string = '';
  public mensagges = "";

  loggedUser: string = "";

 



  private sub!: Subscription;



  constructor(, private auth: Auth, private firestore: Firestore) {}
  /*

  

  getData()
  {
    let col = collection(this.firestore, "chats");

    const filteredQuery = query(
      col, //where("user", "==", "matias.skene@gmail.com"), limit(2), orderBy("fecha", "desc")
    );
    
    const observable = collectionData(filteredQuery);

    this.sub = observable.subscribe((respuesta:any) => {
      this.loginsCollection = respuesta;

      console.log(respuesta);
    })
    
  }
    */
/*
  ngOnInit() {
    this.chat.getMessages().subscribe(messages => {
      this.messages = messages;
    });
  }

  sendMessage() {
    const message: Message = {
      text: this.newMessage,
      createdAt: new Date()
    };
    this.chat.sendMessage(message);
    this.newMessage = '';
  }


  

  redirectToSignIn() {
    this.router.navigate(["/singin"]);
  }
  
  dato = "datsos del padre";

  recibirDato(datoHijo: string)
  {
    this.dato = datoHijo
  }


  @Output() enviarDato = new EventEmitter<string>();

  datoHijo1 = "Dato del hijo 1";

  enviarDatoFn()
  {
    this.enviarDato.emit(this.dato);
  }

  autocompletar(email: string, password: string) 
  {
    this.email = email;
    this.password = password;
  }

  /*
  login() 
  {
    let col = collection(this.firestore, 'logins');

    let obj = { fecha: new Date(), "user": this.email}

    addDoc(col, obj)
      .then(() => {
        console.log(this.email + "s")
        console.log('Documento agregado con éxito');
        console.log(this.email + "s")
      })
      .catch((error) => {
        console.log(this.email + "s")
        console.error('Error al agregar documento: ', error);
        
      });
  }
      


  

}
*/
export class LoginComponent {
  email: string = '';
  password: string = '';
  loginError: boolean = false;

  isLoading = false;
  flagError: boolean = false;
  msjError: string = "";

  constructor(private auth: Auth, private router: Router, private userService : DataService) {}


  loginUser()
  {
    signInWithEmailAndPassword(this.auth, this.email, this.password).then((res) => 
    {
      if ( res.user.email !== null)
      {
        this.isLoading = true;
        setTimeout(() => {
          this.userService.setUser(this.email);
          this.isLoading = false;
          this.router.navigate(["/home"]);
        }, 1000);
      } 

      this.flagError = false;
    }).catch((e) => {
      this.flagError = true;
      console.log(e);

      switch(e.code)
      {
        case "auth/weak-password":
          this.msjError = "Contraseña demasiado corta.";
          break;
        case "auth/invalid-email":
          this.msjError = "Correo electrónico no válido.";
          break;
        case "auth/email-already-in-use":
          this.msjError = "El correo electrónico ya está en uso.";
          break;
        case "auth/user-not-found":
          this.msjError = "No se encontró ningún usuario con este correo.";
          break;
        case "auth/wrong-password":
          this.msjError = "Credenciales Invalidas.";
          break;
        case "auth/invalid-credential":
          this.msjError = "Credenciales no válidas.";
          break;
        case "auth/account-exists-with-different-credential":
          this.msjError = "Ya existe una cuenta con un correo diferente.";
          break;
        case "auth/credential-already-in-use":
          this.msjError = "Estas credenciales ya están en uso por otra cuenta.";
          break;
        default:
          this.msjError = "Error: " + e.code;
          break;
      }
    })
  }

  autocompletar(email: string, password: string) 
  {
    this.email = email;
    this.password = password;
  }

}