import { CommonModule } from '@angular/common';
import { Component } from '@angular/core'; 
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { FormBuilder, FormGroup, FormsModule, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '../../services/usuarios/usuarios.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  
  public email: string = '';
  public password: string = '';
  public mensagges = "";

  loggedUser: string = "";
  flagError: boolean = false;
  flagSuccess : boolean = false;
  msjError: string = "";
  isLoading = false;

  form! : FormGroup;

  resultado : string = "";

  rol : string = "";

  otro = false;

  constructor(public auth: Auth, private router : Router, private fb: FormBuilder, private sendUsers : UsuariosService)
  {

  }

  ngOnInit(): void {
    this.form = new FormGroup({
      nombre: new FormControl("", [Validators.required,Validators.pattern('^[a-zA-Z]+$')]),
      apellido: new FormControl("", [Validators.required,Validators.pattern('^[a-zA-Z]+$')]),
      mail: new FormControl("", Validators.email),
      clave: new FormControl("", Validators.minLength(4)),
      dni: new FormControl("", [Validators.pattern('^[0-9]+$'),Validators.maxLength(10)]),
      role : new FormControl(''),
      edad: new FormControl(''),
      obrasocial: new FormControl(''),
      especialidad: new FormControl(''),
      especialidadOtro: new FormControl(''),
    },);
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

  get role() {
    return this.form.get('role');
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




  enviar()
  { 

    if (this.form.valid) 
    {
      
      console.log('Formulario enviado', this.form.value);
      this.sendUser();
      this.form.reset();
      this.resultado = "El formulario Enviado"
      this.flagSuccess = true;
    } 
    else 
    {
      this.flagError = true;
      console.log("error")
      this.resultado = "El formulario no es válido, Completar los demas Campos"
      this.form.markAllAsTouched();
    }
  }

  adminRegister = false;
  especialistaRegister = false;
  clienteRegister = false;
  

  onRoleChange(event: Event): void {
    const selectedRole = (event.target as HTMLSelectElement).value;
    //const edadControl = this.form.get('edad') as FormControl;
  
    if (selectedRole === 'admin') 
    {
      this.rol = "admin";
      this.adminRegister = true;
      this.clienteRegister = false;
      this.especialistaRegister = false;
      //edadControl.setValidators([Validators.required, Validators.min(18), Validators.max(99)]);
    } 
    else if (selectedRole === 'cliente') 
    {
      this.rol = "cliente"
      this.adminRegister = false;
      this.clienteRegister = true;
      this.especialistaRegister = false;
      //edadControl.setValidators([Validators.required, Validators.max(99)]);
    } 
    else 
    {
      this.adminRegister = false;
      this.clienteRegister = false;
      this.especialistaRegister = true;
      //edadControl.clearValidators();
    }
  
    //edadControl.updateValueAndValidity();
  }

  sendUser()
  {
    switch(this.rol)
    {
      case "cliente":
        this.sendUsers.sendPaciente(
          this.form.value.nombre, 
          this.form.value.apellido, 
          this.form.value.edad, 
          this.form.value.dni, 
          this.form.value.obrasocial, 
          this.form.value.mail, 
          this.form.value.clave, 
        )
      break;
      case "admin":
        this.sendUsers.sendAdmin(
          this.form.value.nombre, 
          this.form.value.apellido, 
          this.form.value.edad, 
          this.form.value.dni, 
          this.form.value.mail, 
          this.form.value.clave, 
        )
      break;
      default:
        this.sendUsers.sendEspecialista(
          this.form.value.nombre, 
          this.form.value.apellido, 
          this.form.value.edad, 
          this.form.value.dni, 
          this.form.value.mail, 
          this.form.value.clave,
          this.especialidades 
        )

        this.otro = false;
        this.especialidades = [];
        
        console.log(this.especialidades)

      break;
    }
  }

  especialidades: string[] = [];


  addEspecialidad() 
  {
    this.otro = true;
  }

  DepartamentList = ["hola", "chau"]

  changeDepartament(e:any)
  {
    this.especialidades.push(e.target.value)
    console.log(this.especialidades)
  }



}
