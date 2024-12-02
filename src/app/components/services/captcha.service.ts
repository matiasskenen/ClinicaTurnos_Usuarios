import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CaptchaService {
  private captchaEnabledSubject = new BehaviorSubject<boolean>(true); // Inicialmente habilitado
  captchaEnabled$ = this.captchaEnabledSubject.asObservable();

  toggleCaptcha() {
    this.captchaEnabledSubject.next(!this.captchaEnabledSubject.value);
  }
}
