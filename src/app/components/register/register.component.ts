import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgxCaptchaModule } from 'ngx-captcha';
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
declare const grecaptcha: any;
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxCaptchaModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
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

  sitekey : string = "6LfqMoEqAAAAAK9FQ8HZZqF3T2ZN0TClF_CgYwJv";

  constructor(
    public auth: Auth,
    private router: Router,
    private fb: FormBuilder,
    private sendUsers: UsuariosService,
  ) {

    
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
      recaptcha: new FormControl('', Validators.required)
      
    });
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

  enviar() {
    if (this.form.valid) {
      console.log('Formulario enviado', this.form.value);
      this.sendUser();
      this.form.reset();
      this.auth.signOut();
      this.resultado = 'El formulario Enviado';
      this.flagSuccess = true;
      this.router.navigate(['/home']);
    } else {
      this.flagError = true;
      console.log('Error Formulario');
      this.resultado = 'El formulario no es válido, Completar los demas Campos';
      this.form.markAllAsTouched();
    }
  }

  adminRegister = false;
  especialistaRegister = false;
  clienteRegister = false;

  onRoleChange(role: string): void {

    this.eleccion = true;
    //const edadControl = this.form.get('edad') as FormControl;

    if (role === 'admin') {
      this.rol = 'admin';
      this.adminRegister = true;
      this.clienteRegister = false;
      this.especialistaRegister = false;
      //edadControl.setValidators([Validators.required, Validators.min(18), Validators.max(99)]);
    } else if (role === 'cliente') {
      this.rol = 'cliente';
      this.adminRegister = false;
      this.clienteRegister = true;
      this.especialistaRegister = false;
      //edadControl.setValidators([Validators.required, Validators.max(99)]);
    } else {
      this.rol = 'especialista';
      this.adminRegister = false;
      this.clienteRegister = false;
      this.especialistaRegister = true;
      //edadControl.clearValidators();
    }

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
      case 'cliente':
        this.sendUsers.sendPaciente(
          this.form.value.nombre,
          this.form.value.apellido,
          this.form.value.edad,
          this.form.value.dni,
          this.form.value.obrasocial,
          this.form.value.mail,
          this.form.value.clave,
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
        );

        break;
      default:
        this.sendUsers.sendEspecialista(
          this.form.value.nombre,
          this.form.value.apellido,
          this.form.value.edad,
          this.form.value.dni,
          this.form.value.mail,
          this.form.value.clave,
          this.especialidadesSeleccionadas,
        );

        this.otro = false;
        this.especialidades = [];

        break;
    }
  }

  especialidades: string[] = [
    'Cardiología',
    'Dermatología',
    'Neurología',
    'Pediatría',
    'Traumatología',
    'Otra',
  ];

  // Objeto para almacenar las especialidades seleccionadas
  especialidadesSeleccionadas: { [key: string]: boolean } = {};

  otraEspecialidad: string = '';

  // Función para manejar el guardado de especialidades
  guardarEspecialidades() {
    // Filtrar las especialidades seleccionadas
    const seleccionadas = Object.keys(this.especialidadesSeleccionadas).filter(
      (especialidad) => this.especialidadesSeleccionadas[especialidad],
    );

    if (this.especialidadesSeleccionadas['Otra'] && this.otraEspecialidad) {
      seleccionadas.push(this.otraEspecialidad);
    }

    // Mostrar las especialidades seleccionadas en la consola
    console.log('Especialidades seleccionadas:', seleccionadas);

    // Opcional: Aquí podrías hacer una solicitud HTTP para enviar los datos al servidor.
  }
}
