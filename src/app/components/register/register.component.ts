import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgxCaptchaModule } from 'ngx-captcha';
import Swal from 'sweetalert2';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import {

  FormBuilder,
  FormGroup,
  FormsModule,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
import { sendEmailVerification } from 'firebase/auth';

import { getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';
import { Storage } from '@angular/fire/storage';
import { Subscription } from 'rxjs';
import { CaptchaDirective } from '../directivas/captcha/captcha.directive';
import { CaptchaService } from '../services/captcha.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxCaptchaModule, CaptchaDirective],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  animations: [
    trigger('routeAnimations', [
      transition('HomePage => LoginPage', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ]),
      // Agregar más transiciones según las necesidades
    ])
  ]
})

export class RegisterComponent {

  captchaValid: boolean = false;
  disableCaptcha: boolean = false; // Controla si el captcha está habilitado
  private captchaSubscription: Subscription;


  public email: string = '';
  public password: string = '';
  public mensagges = '';

  eleccion = false;

  loggedUser: string = '';
  flagError: boolean = false;
  flagSuccess: boolean = false;
  msjError: string = '';
  isLoading = false;

  form!: FormGroup;

  resultado: string = '';

  rol: string = '';

  otro = false;




  imageName: string = '';
  selectedFile: File | null = null;
  downloadURL: string | null = null;

  constructor(
    public auth: Auth,
    private router: Router,
    private fb: FormBuilder,
    private sendUsers: UsuariosService,
    private storage: Storage,
    private captchaService : CaptchaService
  ) {

    this.captchaSubscription = this.captchaService.captchaEnabled$.subscribe(enabled => {
      this.disableCaptcha = !enabled;  // Si está habilitado, disableCaptcha será false
    });
  }

  captchaCode: string = '';
  userInput: string = '';
  captchaVerified: boolean | null = null;

   // Generar CAPTCHA
   generateCaptcha(): void {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    this.captchaCode = Array.from({ length: 6 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    this.userInput = '';
    this.captchaVerified = null;
    this.captchaCode;
  }

  habilitado = false;

  // Verificar CAPTCHA
  verifyCaptcha(): void {
    console.log(this.captchaCode)
    this.captchaVerified = this.userInput === this.captchaCode;

    if(this.captchaVerified == true)
    {
      this.habilitado = true;
    }
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      nombre: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z]+$'),
      ]),
      apellido: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z]+$'),
      ]),
      mail: new FormControl('', Validators.email),
      clave: new FormControl('', Validators.minLength(4)),
      dni: new FormControl('', [
        Validators.pattern('^[0-9]+$'),
        Validators.maxLength(10),
      ]),
      edad: new FormControl(''),
      obrasocial: new FormControl(''),
      especialidad: new FormControl(''),
      especialidadOtro: new FormControl(''),
      captchaInput: new FormControl('', Validators.required)

    });
  }

  get captchaInput() {
    return this.form.get('recaptcha');
  }

  get recaptcha() {
    return this.form.get('recaptcha');
  }

  get especialidad() {
    return this.form.get('especialidad');
  }

  get especialidadOtro() {
    return this.form.get('especialidadOtro');
  }

  get nombre() {
    return this.form.get('nombre');
  }

  get apellido() {
    return this.form.get('apellido');
  }

  get edad() {
    return this.form.get('edad');
  }
  get mail() {
    return this.form.get('mail');
  }
  get clave() {
    return this.form.get('clave');
  }
  get repiteClave() {
    return this.form.get('repiteClave');
  }

  get dni() {
    return this.form.get('dni');
  }

  get obrasocial() {
    return this.form.get('obrasocial');
  }

  

  async enviar() {
    this.isLoading = true;
    await this.uploadImages(); // Esperar a que se genere la URL de la imagen
  
    if (this.form.valid) {
      console.log('Formulario enviado', this.form.value);
      this.sendUser();
      this.isLoading = false;
      //this.form.reset();

      this.resultado = 'El formulario Enviado';
      this.flagSuccess = true;
      Swal.fire({
        title: 'Éxito!',
        text: 'La operación fue exitosa.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      this.router.navigate(['/home']);
    } else {
      this.flagError = true;
      console.log('Error Formulario');
      this.resultado = 'El formulario no es válido o no se cargó la imagen.';
      this.form.markAllAsTouched();
    }
  }

  adminRegister = false;
  especialistaRegister = false;
  clienteRegister = false;

  onRoleChange(role: string): void {

    this.eleccion = true;
    //const edadControl = this.form.get('edad') as FormControl;

    this.rol = role;

    console.log(this.rol)

    //edadControl.updateValueAndValidity();
  }

  sendUser() {
    // Aquí realizas la creación del usuario
    createUserWithEmailAndPassword(
      this.auth,
      this.form.value.mail,
      this.form.value.clave,
    )
      .then((res) => {
        if (res.user.email) {
          // Enviar correo de verificación
          sendEmailVerification(res.user)
            .then(() => {
              console.log('Correo de verificación enviado');
              // Realiza alguna acción si el usuario fue creado exitosamente
              console.log('Usuario creado con éxito:', res.user);
            })
            .catch((error) => {
              console.error('Error al enviar el correo de verificación:', error);
            });
        }
      })
      .catch((error) => {
        // Manejo de errores
        console.error('Error al crear el usuario:', error);
      });

    switch (this.rol) {
      case 'paciente':
        this.sendUsers.sendPaciente(
          this.form.value.nombre,
          this.form.value.apellido,
          this.form.value.edad,
          this.form.value.dni,
          this.form.value.obrasocial,
          this.form.value.mail,
          this.form.value.clave,
          this.imgurl, 
          this.imgurl2
        );
        break;
      case 'admin':
        this.sendUsers.sendAdmin(
          this.form.value.nombre,
          this.form.value.apellido,
          this.form.value.edad,
          this.form.value.dni,
          this.form.value.mail,
          this.form.value.clave,
          this.imgurl
        );

        break;
      default:
        console.log(this.especialidadesSeleccionadas + "esepecialdiadeeeees")
        this.sendUsers.sendEspecialista(
          this.form.value.nombre,
          this.form.value.apellido,
          this.form.value.edad,
          this.form.value.dni,
          this.form.value.mail,
          this.form.value.clave,
          this.especialidadesSeleccionadas,
          this.imgurl
        );

        this.otro = false;
        this.especialidades = [];

        break;
    }
  }

  

  especialidades: string[] = [
    'Cardiología',
    'Dermatología',
    'Pediatría',
  ];

  // Objeto para almacenar las especialidades seleccionadas
  especialidadesSeleccionadas: { [key: string]: boolean } = {};

  OTRAespecialidad = false;

  cambiarOtra()
  {
    this.OTRAespecialidad = true;
  }

  otraEspecialidad: string = '';

  // Función para manejar el guardado de especialidades
  guardarEspecialidades() {
    // Filtrar las especialidades seleccionadas
    const seleccionadas = Object.keys(this.especialidadesSeleccionadas).filter(
      (especialidad) => this.especialidadesSeleccionadas[especialidad],
    );

    // Si se selecciona "Otra especialidad", agregarla a las seleccionadas y al objeto especialidadesSeleccionadas
    if (this.OTRAespecialidad && this.otraEspecialidad.trim()) {
      seleccionadas.push(this.otraEspecialidad);
      this.especialidadesSeleccionadas[this.otraEspecialidad] = true; // Agregar "Otra especialidad" al objeto
      console.log('Especialidad "Otra" agregada:', this.otraEspecialidad);
    }

    // Mostrar las especialidades seleccionadas en la consola
    console.log('Especialidades seleccionadas:', this.especialidadesSeleccionadas);

  }

  selectedFile1: File | null = null;
  selectedFile2: File | null = null;

  onFileSelected(event: Event, imagenId: string): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      if (imagenId === 'imagen1') {
        this.selectedFile1 = input.files[0];
      } else if (imagenId === 'imagen2') {
        this.selectedFile2 = input.files[0];
      }
    }
  }

  imgurl: string = "";
  imgurl2: string = "";

  async uploadImages(): Promise<void> {
    try {
      if (this.rol == "paciente") {
        if (this.selectedFile1 && this.selectedFile2) {
          const filePath1 = `pacientes/${this.selectedFile1.name}`;
          const filePath2 = `pacientes/${this.selectedFile2.name}`;
  
          const storageRef1 = ref(this.storage, filePath1);
          const storageRef2 = ref(this.storage, filePath2);
  
          // Check if selectedFile1 is not null and upload
          if (this.selectedFile1) {
            await uploadBytes(storageRef1, this.selectedFile1);
            this.imgurl = await getDownloadURL(storageRef1);
            console.log('Primera imagen subida:', this.imgurl);
          }
  
          // Check if selectedFile2 is not null and upload
          if (this.selectedFile2) {
            await uploadBytes(storageRef2, this.selectedFile2);
            this.imgurl2 = await getDownloadURL(storageRef2);
            console.log('Segunda imagen subida:', this.imgurl2);
          }
  
        } else {
          console.error('Debes seleccionar ambas imágenes');
        }
      } else {
        const filePath1 = `pacientes/${this.selectedFile1?.name}`;
  
        const storageRef1 = ref(this.storage, filePath1);
  
        // Check if selectedFile1 is not null and upload
        if (this.selectedFile1) {
          await uploadBytes(storageRef1, this.selectedFile1);
          this.imgurl = await getDownloadURL(storageRef1);
          console.log('Primera imagen subida:', this.imgurl);
        }
      }
    } catch (error) {
      console.error('Error al subir imágenes:', error);
    }
  }
  

}
