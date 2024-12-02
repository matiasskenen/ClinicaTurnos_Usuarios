import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[appScroll]',
  standalone: true
})
export class ScrollDirective {
  @Input() scrollToTop: boolean = false; // Si es true, desplazarse al inicio de la página
  @Input() scrollBehavior: 'auto' | 'smooth' = 'smooth'; // Estilo de desplazamiento

  constructor(private el: ElementRef) {}

  @HostListener('click') onClick() {
    // Desplazar hacia la parte superior de la página
    window.scrollTo({
      top: 0, // Siempre arriba del todo
      behavior: 'smooth' // Desplazamiento suave
    });
  }
}
