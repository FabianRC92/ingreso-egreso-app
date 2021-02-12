import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  registroForm: FormGroup;
  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }


  crearUsuario() {

    if (this.registroForm.valid) {

      const { nombre, correo, password } = this.registroForm.value;

      this.authService.crearUsuario(nombre, correo, password).then(credenciales => {
        this.router.navigate(['/login'])
      })
        .catch(err => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al registar el usuario'
          })
        });
    }

  }

}
