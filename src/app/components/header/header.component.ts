import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/authUsers/data.service';
import { Auth, signOut } from '@angular/fire/auth';
import { TurnosService } from '../../services/turnos/turnos.service';
import { UsuariosService } from '../../services/usuarios/usuarios.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  user: any;
  perfil: any;

  constructor(
    private router: Router,
    private authService: DataService,
    private auth: Auth,
    private userService: UsuariosService,
    private turnos: TurnosService,
    private authservice: DataService,
  ) {
    this.checkUser();
  }

  checkUser(): void {
        this.auth.onAuthStateChanged((user) => {
          if (user) {
            this.user = user.email;
            console.log('Usuario detectado:', user);
            console.log('Usuario verificado. Permitir acceso.');
            // Verificar el perfil solo después de que el usuario esté disponible
            this.checkPerfil('especialistas');
            this.checkPerfil('admins');
            this.checkPerfil('pacientes');
          } else {
            console.log('Usuario no verificado. Cerrando sesión...');
            this.auth.signOut();
          }
        });
  }


  /*

    checkUser(): void {
    this.authService.userVerificado$.subscribe((verificado) => {
      if (verificado) {
        this.auth.onAuthStateChanged((user) => {
          if (user) {
            this.user = user.email;
            console.log('Usuario detectado:', user.email);
            console.log('Usuario verificado. Permitir acceso.');
            // Verificar el perfil solo después de que el usuario esté disponible
            this.checkPerfil('especialistas');
            this.checkPerfil('admins');
            this.checkPerfil('pacientes');
          } else {
            console.log('Usuario no verificado. Cerrando sesión...');
            this.auth.signOut();
          }
        });
      }
    });
  }

  checkUser(): void {

    if(this.authservice.getUser() != "")
      {
        this.userVerificado = true;
        this.auth.onAuthStateChanged((user) => {
          this.user = user?.email;
          this.checkPerfil('especialistas');
          this.checkPerfil('admins');
          this.checkPerfil('pacientes');
        });
      }

  }
      */


  checkPerfil(name: any) {
    this.userService.getEspecialistas(name).subscribe((data: any[]) => {
      console.log(data);  // Verifica los datos
      data.forEach((item) => {
        if (item.email == this.user) {
          this.perfil = item.perfil;
        }
      });
    });
  }

  navigateTo(route: string) {
    switch (route) {
      case 'home': this.router.navigate(['/home']); break;
      case 'login': this.router.navigate(['/login']); break;
      case 'register': this.router.navigate(['/register']); break;
      case 'turnoPaciente': this.router.navigate(['/turnoPaciente']); break;
      case 'turnosEspecialistas': this.router.navigate(['/turnosEspecialistas']); break;
      case 'turnoAdmin': this.router.navigate(['/turnoAdmin']); break;
      case 'perfilPaciente': this.router.navigate(['/perfilPaciente']); break;
      case 'perfilEspecialista': this.router.navigate(['/perfilEspecialista']); break;
      case 'perfilAdmin': this.router.navigate(['/perfilAdmin']); break;
      case 'seccionusuarios': this.router.navigate(['/seccionusuarios']); break;
      case 'pacientesAtendidos': this.router.navigate(['/pacientesAtendidos']); break;
      default: console.log('Ruta no encontrada'); break;
    }
  }

  async signOut() {
    try {
      await this.auth.signOut();
      this.user = '';
      this.perfil = '';
      this.authService.setUserVerificado(false);
      console.log(this.authService.getVerificado() + "verficado..")
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
}
