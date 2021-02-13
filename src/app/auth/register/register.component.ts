import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as ui from '../../shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm: FormGroup;
  cargando: boolean = false;
  uiSubscription: Subscription;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>) { }


  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  ngOnInit(): void {

    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.uiSubscription = this.store.select('ui').subscribe(ui => this.cargando = ui.isLoading);

  }


  crearUsuario() {

    if (this.registroForm.valid) {

      const { nombre, correo, password } = this.registroForm.value;
      this.store.dispatch(ui.isLoading())

      this.authService.crearUsuario(nombre, correo, password).then(credenciales => {
        this.store.dispatch(ui.stopLoading());
        this.router.navigate(['/login'])
      })
        .catch(err => {
          this.store.dispatch(ui.stopLoading());
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al registar el usuario'
          })
        });
    }

  }

}
