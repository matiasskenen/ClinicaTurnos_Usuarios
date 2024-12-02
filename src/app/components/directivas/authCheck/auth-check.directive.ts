import { Directive, ElementRef, Renderer2 } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Directive({
  selector: '[appAuthCheck]',
  standalone: true
})
export class AuthCheckDirective {
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private auth: Auth
  ) {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // Usuario logueado: asegura que el elemento esté visible
        this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'block');
      } else {
        // Usuario no logueado: oculta el elemento
        this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'none');
      }
    });
  }
}
