import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';
@Directive({
  selector: '[appAgrandarbtn]',
  standalone: true
})
export class AgrandarbtnDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.resizeButton('1.2');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.resizeButton('1'); 
  }

  private resizeButton(scale: string) {
    this.renderer.setStyle(this.el.nativeElement, 'transform', `scale(${scale})`);
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform 0.3s ease');
  }

}
