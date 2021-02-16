import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { IngresoEgreso } from '../../model/ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppStateIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {

  listaIngresoEgreso: IngresoEgreso[] = [];
  ingresosSubs: Subscription;

  constructor(private store: Store<AppStateIngreso>,
    private ingresoEgresoService: IngresoEgresoService) { }

  ngOnDestroy(): void {
    this.ingresosSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.ingresosSubs = this.store.select('ingresosEgresos')
      .subscribe(({ items }) => this.listaIngresoEgreso = items)
  }


  borrar(id: string) {

    this.ingresoEgresoService.borrarItems(id)
      .then(() => Swal.fire('Borrado', 'Item eliminado correctamente', 'success'))
      .catch(err => Swal.fire('Error', err.message, 'error'));

  }

}
