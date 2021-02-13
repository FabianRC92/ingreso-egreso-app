import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { AppState } from '../../app.reducer';
import * as ui from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
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

    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.uiSubscription = this.store.select('ui').subscribe(ui => this.cargando = ui.isLoading);

  }


  ingresar() {

    if (this.loginForm.valid) {

      const { correo, password } = this.loginForm.value;
      this.store.dispatch(ui.isLoading())

      this.authService.loginUsuario(correo, password).then(credenciales => {

        this.store.dispatch(ui.stopLoading());
        this.router.navigate(['/']);

      })
        .catch(err => {
          this.store.dispatch(ui.stopLoading());
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.message
          })
        });
    }
  }

}
