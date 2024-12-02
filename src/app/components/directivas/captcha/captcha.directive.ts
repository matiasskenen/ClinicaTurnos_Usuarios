import { Directive, Renderer2, ElementRef, EventEmitter, Output, Input } from '@angular/core';

@Directive({
  selector: '[appCaptcha]',
  standalone: true,
})
export class CaptchaDirective {
  @Output() captchaVerified = new EventEmitter<boolean>(); // Emite si el CAPTCHA es válido

  private _disabled: boolean = false; // Variable interna para gestionar el estado de `disabled`
  private captchaCode: string = '';
  private userInput: string = '';

  @Input()
  set disabled(value: boolean) {
    this._disabled = value;
    this.toggleCaptcha();
  }

  get disabled(): boolean {
    return this._disabled;
  }

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    if (!this.disabled) {
      this.initCaptcha();
    }
  }

  private initCaptcha() {
    // Crear elementos del CAPTCHA
    const container = this.renderer.createElement('div');
    const text = this.renderer.createElement('p');
    const input = this.renderer.createElement('input');
    const refreshButton = this.renderer.createElement('button');
    const verifyButton = this.renderer.createElement('button');
    const feedback = this.renderer.createElement('p');

    // Asignar clases
    this.renderer.addClass(container, 'captcha-container');
    this.renderer.addClass(text, 'captcha-text');
    this.renderer.addClass(input, 'captcha-input');
    this.renderer.addClass(refreshButton, 'captcha-refresh');
    this.renderer.addClass(verifyButton, 'captcha-verify');

    // Configurar elementos
    this.renderer.setProperty(refreshButton, 'innerHTML', '🔄');
    this.renderer.setProperty(verifyButton, 'innerHTML', 'Verificar');
    this.generateCaptcha(text); // Genera el CAPTCHA inicial

    this.renderer.setProperty(input, 'placeholder', 'Ingrese el texto del CAPTCHA');
    this.renderer.setAttribute(input, 'required', 'true');

    // Añadir eventos
    this.renderer.listen(refreshButton, 'click', () => this.generateCaptcha(text, feedback));
    this.renderer.listen(verifyButton, 'click', () => {
      this.userInput = input.value;
      this.verifyCaptcha(feedback);
    });

    // Añadir elementos al contenedor
    this.renderer.appendChild(container, text);
    this.renderer.appendChild(container, refreshButton);
    this.renderer.appendChild(container, input);
    this.renderer.appendChild(container, verifyButton);
    this.renderer.appendChild(container, feedback);

    // Insertar el contenedor en el elemento donde se usa la directiva
    this.renderer.appendChild(this.el.nativeElement, container);
  }

  private toggleCaptcha(): void {
    if (this.disabled) {
      this.el.nativeElement.innerHTML = ''; // Elimina el CAPTCHA si está deshabilitado
    } else {
      this.initCaptcha(); // Lo inicializa si está habilitado
    }
  }

  private generateCaptcha(textElement?: HTMLElement, feedbackElement?: HTMLElement): void {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    this.captchaCode = Array.from({ length: 6 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');

    if (textElement) {
      textElement.innerText = this.captchaCode;
    }
    if (feedbackElement) {
      feedbackElement.innerText = '';
    }
  }

  private verifyCaptcha(feedbackElement: HTMLElement): void {
    const isValid = this.userInput === this.captchaCode;
    this.captchaVerified.emit(isValid); // Notifica si el CAPTCHA es válido
    feedbackElement.innerText = isValid ? '✔️ CAPTCHA Correcto' : '❌ CAPTCHA Incorrecto';
    this.renderer.setStyle(feedbackElement, 'color', isValid ? 'green' : 'red');
  }
}
