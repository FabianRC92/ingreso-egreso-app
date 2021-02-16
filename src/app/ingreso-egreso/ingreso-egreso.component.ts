import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as ui from '../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoForm: FormGroup;
  tipo: string = "ingreso";
  cargando: boolean = false;
  loadingSubs: Subscription;

  constructor(private fb: FormBuilder,
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>) { }

  ngOnDestroy(): void {
    this.loadingSubs.unsubscribe();
  }

  ngOnInit(): void {

    this.loadingSubs = this.store.select('ui').subscribe(ui => this.cargando = ui.isLoading)

    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required],
      tipo: ''
    });

  }

  guardar() {


    if (this.ingresoForm.valid) {

      this.store.dispatch(ui.isLoading());

      this.ingresoForm.controls.tipo.setValue(this.tipo);
      this.ingresoEgresoService.crearIngresoEgreso(this.ingresoForm.value)
        .then(() => {
          Swal.fire('Registro creado', this.ingresoForm.controls.descripcion.value, 'success')
          this.ingresoForm.reset();
          this.store.dispatch(ui.stopLoading());
        })
        .catch((err) => {
          Swal.fire('Error', err.message, 'error')
          this.store.dispatch(ui.stopLoading());
        });

    }
  }

}
