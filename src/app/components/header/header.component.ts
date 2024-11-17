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
    private turnos : TurnosService
  ) {
    this.checkUser();
    this.checkPerfil('especialistas');
    this.checkPerfil('admins');
    this.checkPerfil('pacientes');
  }

  checkUser() {

    this.auth.onAuthStateChanged((user) => {
      if (user) 
      {
        this.verificarRole();
        if(this.role != "")
        {
          this.user = user.email;
          this.authService.setUser(user);
          console.log('usuario verificado.' + user.email);
        }
        else{
          this.verficarAdmin();
          if (user.emailVerified) {
            this.user = user.email;
            this.authService.setUser(user);
            console.log('usuario verificado.' + user.email);
          } else {
            console.log('No hay usuario verificado.');
          }
        }
        
      } else {
        console.log('No hay usuario autenticado.');
      }
    });
  }

  checkPerfil(name: any) {
    this.userService.getEspecialistas(name).subscribe((data: any[]) => {
      // Si los datos son un arreglo de objetos, accedes a nombre de cada objeto
      data.forEach((item) => {
        if (item.email == this.user) {
          this.perfil = item.perfil;
        }
      });
    });
  }

  navigateTo(route: string) {
    switch (route) {
      case 'home':
        this.router.navigate(['/home']);
        break;
      case 'login':
        this.router.navigate(['/login']);
        break;
      case 'register':
        this.router.navigate(['/register']);
        break;
      case 'turnoPaciente':
        this.router.navigate(['/turnoPaciente']);
        break;
      case 'turnosEspecialistas':
        this.router.navigate(['/turnosEspecialistas']);
        break;
      case 'turnoAdmin':
        this.router.navigate(['/turnoAdmin']);
        break;
      case 'perfilPaciente':
        this.router.navigate(['/perfilPaciente']);
        break;
      case 'perfilEspecialista':
        this.router.navigate(['/perfilEspecialista']);
        break;
      case 'perfilAdmin':
        this.router.navigate(['/perfilAdmin']);
        break;
      case 'seccionusuarios':
        this.router.navigate(['/seccionusuarios']);
        break;
      default:
        console.log('Ruta no encontrada');
        break;
    }
  }

  async signOut() {
    try {
      await this.auth.signOut();
      this.user = '';
      this.perfil = '';
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  nombresEspecialistasArray: any[] = [];
  nombresFiltrados: any[] = [];
  verficado = false;

  verficarAdmin() {
    /*
    this.turnos.getEspecialistas().subscribe((data: any[]) => {
      this.nombresEspecialistasArray = data.map((especialista: any) => ({
        nombre: especialista.nombre,
        verificado: especialista.verificado,
        email: especialista.email,
      }));
      this.nombresFiltrados = [...this.nombresEspecialistasArray];

      this.nombresFiltrados.forEach((usuario) => {
        console.log(usuario);
        if (usuario.email == this.user) {
          if (usuario.verficado == false) {
            this.verficado = false;
          } else {
            this.verficado = true;
          }
        } // Imprime cada elemento del array
      });
    });
    */
  }

  role : string = "";

  verificarRole() {
    this.turnos.getUsuarios().subscribe((data: any[]) => {
      this.nombresEspecialistasArray = data.map((especialista: any) => ({
        email: especialista.email,
        perfil: especialista.perfil,
      }));
      this.nombresFiltrados = [...this.nombresEspecialistasArray];

      this.nombresFiltrados.forEach((usuario) => {
        if (usuario.email == this.user) {
          this.role = 'paciente';
        } 
      });
    });

    this.nombresEspecialistasArray = [];
    this.nombresFiltrados = [];

    this.turnos.getAdmins().subscribe((data: any[]) => {
      this.nombresEspecialistasArray = data.map((especialista: any) => ({
        email: especialista.email,
        perfil: especialista.perfil,
      }));
      this.nombresFiltrados = [...this.nombresEspecialistasArray];

      this.nombresFiltrados.forEach((usuario) => {
        if (usuario.email == this.user) {
          this.role = 'admin';
        } 
      });
    });
  }


}
