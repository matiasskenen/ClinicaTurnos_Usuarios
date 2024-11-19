import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { browserLocalPersistence, setPersistence } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(private auth : Auth)
  {
    
  }

  title = 'tplabo4final';

  async setSessionPersistence() {
    try {
      await setPersistence(this.auth, browserLocalPersistence);
      console.log('Persistencia de sesión configurada correctamente.');
    } catch (error) {
      console.error('Error configurando la persistencia de sesión:', error);
    }
  }

}
