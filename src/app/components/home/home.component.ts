import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../services/authUsers/data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  userVerificado = false;

  constructor(private router: Router, private auth: Auth, private service : DataService)
  {
    this.checkUser();

  }

  checkUser() {
    if(this.service.getUser() != "")
    {
      this.userVerificado = true;
    }
  }

  navigateTo(route: string) {
    switch(route) {
      case 'login':
        this.router.navigate(['/login']);
        break;
      case 'register':
        this.router.navigate(['/register']);
        break;
    }
  }
  

}
