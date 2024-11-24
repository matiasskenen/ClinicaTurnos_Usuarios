import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Auth, signInWithEmailAndPassword, user } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  collectionData,
  setDoc,
  DocumentData,
  doc,
  addDoc,
} from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { orderBy, query, where } from 'firebase/firestore';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { DataService } from '../../services/authUsers/data.service';
import { map } from 'rxjs/operators';
import { signOut, User } from 'firebase/auth';
import { TurnosService } from '../../services/turnos/turnos.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loginError: boolean = false;

  isLoading = false;
  flagError: boolean = false;
  msjError: string = '';

  role: string = '';

  verficado = false;

  users = [
    { name: 'sigak61149@cpaurl.com', role: 'Paciente', image: 'https://firebasestorage.googleapis.com/v0/b/tplabo4final.firebasestorage.app/o/pacientes%2Flucasperfil4.PNG?alt=media&token=89ce458e-cd93-4ed1-a358-9c36b5d9bc8a' },
    { name: 'hevame6403@exoular.com', role: 'Paciente', image: 'https://firebasestorage.googleapis.com/v0/b/tplabo4final.firebasestorage.app/o/pacientes%2Flucasperfil.PNG?alt=media&token=83d2a4ec-86df-47eb-8dba-49a16ed8bd20' },
    { name: 'micaela@gmail.com', role: 'Paciente', image: 'https://randomuser.me/api/portraits/men/3.jpg' },
    { name: 'nohiy55680@exoular.com', role: 'Especialista', image: 'https://firebasestorage.googleapis.com/v0/b/tplabo4final.firebasestorage.app/o/images%2Ffotodoctor1.PNG?alt=media&token=21bd5ccc-67ef-4941-9d34-a235fe538197' },
    { name: 'sipavag916@cpaurl.com', role: 'Especialista', image: 'https://firebasestorage.googleapis.com/v0/b/tplabo4final.firebasestorage.app/o/images%2Ffotodoctor2.PNG?alt=media&token=5807ca68-5ea3-45d8-b9e4-7af5c00fab09' },
    { name: 'matias.skenen@gmail.com', role: 'Admin', image: 'https://firebasestorage.googleapis.com/v0/b/tplabo4final.firebasestorage.app/o/images%2Ffotoperfiladmin.PNG?alt=media&token=926b0854-0d85-4a7a-bf18-311b806654f4' },
  ];

  constructor(
    private auth: Auth,
    private router: Router,
    private userService: DataService,
    private firestore: Firestore,
    private turnos: TurnosService,
  ) {}

  loginUser() {
    this.userService.setUserVerificado(false);
    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then((res) => {
        if (res.user.email !== null) {
          this.isLoading = true;
          // Llamar a verificarRoles después de hacer login
          this.verificarRoles();
          this.verificarAdmin();
  
          // Esperar a que el rol se haya asignado
          setTimeout(() => {
            if (this.role !== '') {
              this.userService.setUser(this.email);
              console.log(this.role)
              this.userService.setUserVerificado(true);
              this.router.navigate(['/home']);
            } else {

              console.log(res.user.emailVerified)
              console.log(this.verficado)

              if (res.user.emailVerified)
                {
                  if(this.verficado)
                  {
                    this.userService.setUser(this.email);
                    this.actualizarEstadoVerificacion(res.user);
                    this.router.navigate(['/home']);
                    this.userService.setUserVerificado(true);
                  
                  }
                  else
                  {
                    this.msjError = 'El usuario No esta verficiado por Admin.';
                    console.log('El usuario no está verificado por Admin');
                    this.flagError = true;
                  }
                }
                else
                {
                  this.msjError = 'El usuario no esta verficiado por mail.';
                  console.log('El usuario no está verificado por mail');
                  this.flagError = true;
                }  
                
            }
          }, 1000); // Ajusta el tiempo según sea necesario
        }
      })
      .catch((e) => {
        this.flagError = true;
        this.handleLoginError(e);
      });


  }

  handleLoginError(error: any) {
    console.log(error);
    switch (error.code) {
      case 'auth/invalid-credential':
        this.msjError = 'Credenciales Incorrectas';
        break;
      case 'auth/weak-password':
        this.msjError = 'Contraseña demasiado corta.';
        break;
      case 'auth/invalid-email':
        this.msjError = 'Correo electrónico no válido.';
        break;
      case 'auth/email-already-in-use':
        this.msjError = 'El correo electrónico ya está en uso.';
        break;
      case 'auth/user-not-found':
        this.msjError = 'No se encontró ningún usuario con este correo.';
        break;
      case 'auth/wrong-password':
        this.msjError = 'Credenciales Invalidas.';
        break;
      default:
        this.msjError = 'Error: ' + error.code;
        break;
    }
  }

  autocompletar(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  // Actualizar el estado de verificación del correo en Firestore
  actualizarEstadoVerificacion(user: User) {
    const userRef = doc(this.firestore, 'usuarios', user.uid); // Aquí estamos usando el UID del usuario para obtener el documento
    setDoc(
      userRef,
      {
        emailVerified: user.emailVerified, // Guardar el estado de verificación en Firestore
      },
      { merge: true },
    )
      .then(() => {
        console.log('Estado de verificación actualizado en Firestore');
      })
      .catch((error) => {
        console.log(
          'Error al actualizar el estado de verificación en Firestore: ',
          error,
        );
      });
  }

  async verificarAdmin() {
    await this.verficarAdmin();
    // Puedes agregar más verificaciones de roles aquí si es necesario
  }

  async verficarAdmin() {
    this.turnos.getEspecialistas().subscribe(
      (data: any[]) => {
        this.nombresEspecialistasArray = data.map((especialista: any) => ({
          nombre: especialista.nombre,
          verificado: especialista.verificado,
          email: especialista.email,
        }));
  
        this.nombresFiltrados = [...this.nombresEspecialistasArray];
  
        this.nombresFiltrados.forEach((usuario) => {
          if (usuario.email === this.email) {
            if(usuario.verificado == true)
            {
              this.verficado = true;
              console.log("verificado por admin")
            }
            else
            {
              this.verficado = false;
              console.log("no verificado por admin")
            }
            // Agrega la lógica necesaria aquí si necesitas hacer algo con el usuario encontrado.
          }
        });
      },
      (error) => {
        console.error('Error al obtener especialistas:', error);
        // Maneja el error según sea necesario.
      }
    );
  }




  nombresEspecialistasArray: any[] = [];
  nombresFiltrados: any[] = [];

  async verificarRoles() {
    await this.verificarClientes();
    await this.verficarAdmins();
    // Puedes agregar más verificaciones de roles aquí si es necesario
  }



  async verificarClientes() {
    console.log('Verificando rol para email: ' + this.email);
  
    this.turnos.getUsuarios().subscribe((data: any[]) => {
      this.nombresEspecialistasArray = data.map((especialista: any) => ({
        email: especialista.email,
        perfil: especialista.perfil,
      }));
      this.nombresFiltrados = [...this.nombresEspecialistasArray];

      this.nombresFiltrados.forEach((usuario) => {
        if (usuario.email == this.email) {
          this.role = 'paciente';
        } 
      });
    });
  }

  async verficarAdmins() {
    console.log('Verificando rol para email: ' + this.email);
  
    this.turnos.getAdmins().subscribe((data: any[]) => {
      this.nombresEspecialistasArray = data.map((especialista: any) => ({
        email: especialista.email,
        perfil: especialista.perfil,
      }));
      this.nombresFiltrados = [...this.nombresEspecialistasArray];

      this.nombresFiltrados.forEach((usuario) => {
        if (usuario.email == this.email) {
          this.role = 'admin';
        } 
      });
    });
  }
  
}
