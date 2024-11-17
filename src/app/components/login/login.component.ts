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

  constructor(
    private auth: Auth,
    private router: Router,
    private userService: DataService,
    private firestore: Firestore,
    private turnos: TurnosService,
  ) {}

  loginUser() {
    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then((res) => {
        if (res.user.email !== null) {
          this.isLoading = true;
          this.userService.setUser(this.email);
          this.isLoading = false;
  
          // Llamar a verificarRoles después de hacer login
          this.verificarRoles();
  
          // Esperar a que el rol se haya asignado
          setTimeout(() => {
            if (this.role !== '') {
              console.log(this.role)
              this.router.navigate(['/home']);
            } else {
              
              this.verificarAdmin();

              if (res.user.emailVerified && this.verficado) {
                this.actualizarEstadoVerificacion(res.user);
                this.router.navigate(['/home']);
              } else {
                this.msjError = 'Por favor verifica tu correo electrónico.';
                console.log('El usuario no está verificado por mail');
                this.flagError = true;
              }

              this.flagError = true;
              this.msjError = 'El usuario no esta verificado.';
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
            if(usuario.verificado)
            {
              this.verficado = true;
            }
            else
            {
              this.verficado = false;
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
