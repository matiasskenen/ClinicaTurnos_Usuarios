import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../../../services/authUsers/data.service';
import { Auth } from '@angular/fire/auth';
import { UsuariosService } from '../../../../services/usuarios/usuarios.service';

@Component({
  selector: 'app-especialista-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './especialista-perfil.component.html',
  styleUrl: './especialista-perfil.component.scss'
})
export class EspecialistaPerfilComponent {

  constructor(private authService: DataService, private auth : Auth, private userService : UsuariosService)
  {
    this.checkUser();
    this.checkPerfil("especialistas");

  }

  DepartamentList = ["9:00 a 17:00", "7:00 a 15:00"]

  horario : any;
  user : any;
  getHorario : any;

  changeDepartament(e:any)
  {
    if(e.target.value == "9:00 a 17:00")
    {
      this.horario = "9/17"
    }
    else
    {
      this.horario = "7/15"
    }

  }

  saveDataHorario()
  {
    this.userService.ingresarHorario(this.authService.getUser(), this.horario)
  }

  checkUser()
  {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.user = user.email;
      } else {
        console.log("No hay usuario autenticado.");
      }
    });
  }

  checkPerfil(name : any)
  {
    this.userService.getEspecialistas(name).subscribe((data: any[]) => {
      // Si los datos son un arreglo de objetos, accedes a nombre de cada objeto
      data.forEach(item => {
        if(item.email == this.user)
        {
          this.getHorario = item.horario
        }
      });


    });
  }



  
  


}
